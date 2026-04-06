// lib/server-utils.ts 🔒

import "server-only";

import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ulid } from "ulid";

export const dynamic = "force-dynamic";

export async function requireAnyRole(roles: Role[]) {
  const session = await auth();

  if (!session) {
    const { headers } = await import("next/headers");
    const currentUrl = (await headers()).get("referer") || "/";
    redirect(`authentication?callbackUrl=${encodeURIComponent(currentUrl)}`);
  }

  if (!roles.includes((session.user as any).role)) {
    redirect("/not-authorized");
  }

  return session;
}

/** * * @returns random string */ 
export const ulidId = () => ulid();