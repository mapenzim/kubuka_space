import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {label:"Email", type:"text"}, password: {label:"Password", type:"password"} },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ 
          where: { email: String(credentials.email) },
          include: { role: true, cartItems: true },
        });
        
        if (!user) throw new Error("No user found with that email");

        const valid = await compare(String(credentials.password), user.password);
        if (!valid) throw new Error("Invalid password");

        // return minimal object
        return {    
          id: String(user.id),
          name: user.name || "Anonymous",
          email: user.email,
          role: user.role?.name ?? "USER",
          roleId: user.roleId,
          cartItems: user.cartItems,

        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user?.role; 
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
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/authentication" },
  secret: process.env.NEXTAUTH_SECRET
});
