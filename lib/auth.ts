import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from './prisma';
import NextAuth, { type User } from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email as string }
        });

        if (!user) return null;

        const isValid = compare(credentials?.password as string, user?.password as string);

        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session?.user as any).role = token.role;
      }
      return session;
    }
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
});
