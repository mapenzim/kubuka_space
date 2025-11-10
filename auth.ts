import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {label:"Email", type:"text"}, password: {label:"Password", type:"password"} },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ 
          where: { email: String(credentials.email) },
          include: { role: true },
        });
        
        if (!user) throw new Error("No user found with that email");
        //if (!user) return null;

        const valid = await compare(String(credentials.password), user.password);
        if (!valid) throw new Error("Invalid password");

        // if (!valid) return null;
        // return minimal object
        return { id: String(user.id), name: user.name, email: user.email, role: user.role, roleId: user.roleId };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on sign in, user will exist
      if (user) {
        token.role = (user as any).role.name;
        token.id = (user as any).id ?? token.sub;
      } else {
        // optionally refresh from DB if needed
        if (!token.role && token.sub) {
          const dbUser = await prisma.user.findUnique({ 
            where: { id: Number(token.sub) },
            include: { role: true },
          });
          if (dbUser) token.role = dbUser?.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // attach role and id to session.user
      (session.user as any).role = token.role;
      (session.user as any).id = token.id;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/authentication" },
  secret: process.env.NEXTAUTH_SECRET
});
