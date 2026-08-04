import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

export const dynamic = "force-dynamic";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

// Keep sign-in sessions finite. Users must authenticate again after 30 days.
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

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
  } as any) as any, // workaround for typing

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
          where: { email: String(credentials.email) },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: { select: { name: true } },
          },
        });

        if (!user) throw new Error("No user found with that email");

        const valid = await compare(
          String(credentials.password),
          user.password
        );

        if (!valid) throw new Error("Invalid password");

        return {
          id: String(user.id),
          name: user.name || "Anonymous",
          email: user.email,
          role: user.role?.name ?? "USER",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (!token.id && token.sub) {
        token.id = token.sub;
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
      session.user.role = token.role as string;
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
