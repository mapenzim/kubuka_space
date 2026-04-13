import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      bio?: {
        id: string;
        text: string;
        userId: string;
      };
      social?: any[];
      skills?: any[]; 
      cartItems?: any[];
      workExperience?: any[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    bio?: {
      id: string;
      text: string;
      userId: string;
    };
    social?: any[];
    skills?: any[];
    cartItems?: any[];
    workExperience?: any[];
  }

  interface JWT {
    id: string;
    role: string;
    bio?: {
      id: string;
      text: string;
      userId: string;
    };
    social?: any[];
    skills?: any[];
    cartItems?: any[];
    workExperience?: any[];
  }
}