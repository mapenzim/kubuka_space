import type { DefaultSession } from "next-auth";
import type { AppRole } from "@/lib/rbac/policy";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Exclude<AppRole, "GUEST">;
      status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
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
    role: Exclude<AppRole, "GUEST">;
    status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
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
    role: Exclude<AppRole, "GUEST">;
    status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
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
