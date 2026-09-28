import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { AppRole, isAppRole } from "@/lib/rbac/policy";

export const dynamic = "force-dynamic";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

// Keep sign-in sessions finite. Users must authenticate again after 30 days.
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
type AccountRole = Exclude<AppRole, "GUEST">;

function accountRole(role: unknown): AccountRole {
  return isAppRole(role) && role !== "GUEST" ? role : "USER";
}

async function getPrisma() {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter({
      async getAdapter() {
        const prisma = await getPrisma();
        return prisma;
      },
    } as unknown as Parameters<typeof PrismaAdapter>[0]) as unknown as NonNullable<
      NextAuthConfig["adapter"]
    >,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const prisma = await getPrisma();

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email).trim().toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            status: true,
            role: { select: { name: true } },
          },
        });

        if (!user) throw new Error("No user found with that email");

        if (user.status !== "ACTIVE") {
          throw new Error("This account is suspended or archived");
        }

        const valid = await compare(
          String(credentials.password),
          user.password
        );

        if (!valid) throw new Error("Invalid password");

        return {
          id: String(user.id),
          name: user.name || "Anonymous",
          email: user.email,
          role: accountRole(user.role?.name),
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      } else {
        const accountId = token.id ?? token.sub;

        if (accountId) {
          token.id = accountId;
          const prisma = await getPrisma();
          const account = await prisma.user.findUnique({
            where: { id: String(accountId) },
            select: {
              status: true,
              role: { select: { name: true } },
            },
          });

          token.status = account?.status ?? "ARCHIVED";
          token.role = accountRole(account?.role?.name);
        }
      }

      // Keep database relations out of the JWT. They make the production
      // cookie unnecessarily large and can leave stale profile data behind.
      delete token.cartItems;
      delete token.skills;
      delete token.social;
      delete token.workExperience;
      delete token.bio;

      return token;
    },

    async session({ session, token }) {
      session.user.id = (token.id ?? token.sub) as string;
      session.user.role = accountRole(token.role);
      session.user.status = token.status as "ACTIVE" | "SUSPENDED" | "ARCHIVED";
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: { signIn: "/authentication" },
  secret: authSecret,
});
