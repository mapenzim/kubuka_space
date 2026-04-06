import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

export const dynamic = "force-dynamic";

async function getPrisma() {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter({
    async getAdapter() {
      const prisma = await getPrisma();
      return PrismaAdapter(prisma);
    },
  } as any), // workaround for typing

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
          include: { role: true, cartItems: true },
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
          roleId: user.roleId,
          cartItems: user.cartItems,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const prisma = await getPrisma();

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.cartItems = user.cartItems;
      } else if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { role: true, cartItems: true },
        });

        if (dbUser) {
          token.role = dbUser.role?.name ?? "USER";
          token.cartItems = dbUser.cartItems;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.cartItems = token.cartItems as string[];
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/authentication" },
  secret: process.env.NEXTAUTH_SECRET,
});