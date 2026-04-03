import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      cartItems?: any[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    cartItems?: any[];
  }

  interface JWT {
    id: string;
    role: string;
    cartItems?: any[];
  }
}