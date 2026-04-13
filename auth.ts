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
          include: { 
            role: true, 
            cartItems: true, 
            bio: true, skills: true, 
            social: true, 
            workExperience: true
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
          roleId: user.roleId,
          cartItems: user.cartItems,
          'bio.id': String(user.bio?.id),
          'bio.text': String(user.bio?.text),
          'bio.userId': String(user.bio?.userId),
          skills: user.skills,
          social: user.social,
          workExperience: user.workExperience
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, user, session }) {
      const prisma = await getPrisma();

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.cartItems = user.cartItems;
        token.skills = user.skills;
        token.social = user.social;
        token.workExperience = user.workExperience;
        token.bio = user.bio;
      } else if (!token.role && !token.bio && !token.skills && !token.social && !token.workExperience && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { 
            role: true, 
            cartItems: true, 
            bio: true, 
            social: true, 
            skills: true, 
            workExperience: true
          },
        });

        if (dbUser) {
          token.role = dbUser.role?.name ?? "USER";
          token.cartItems = dbUser.cartItems;
          token.skills = dbUser.skills;
          token.social = dbUser.social;
          token.workExperience = dbUser.workExperience;
          token.bio = dbUser.bio;
        }

        // 🔥 Handle manual session update
        if (trigger === "update" && session?.bio) {
          token.bio = {
            ...(token.bio || {}),
            ...session.bio,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.cartItems = token.cartItems as string[];
      session.user.social = token.social as string[];
      session.user.skills = token.skills as string[];
      session.user.workExperience = token.workExperience as string[];
      session.user.bio = token.bio as {
        id: string;
          text: string;
          userId: string;
        };
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/authentication" },
  secret: process.env.NEXTAUTH_SECRET,
});
