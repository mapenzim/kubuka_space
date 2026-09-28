// lib/server-utils.ts 🔒

import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ulid } from "ulid";
import { Role } from "./roles";
import { getActiveActor } from "@/lib/rbac/server";

export const dynamic = "force-dynamic";

export async function requireAnyRole(roles: Role[]) {
  const [session, actor] = await Promise.all([auth(), getActiveActor()]);

  if (!session || !actor) {
    const { headers } = await import("next/headers");
    const currentUrl = (await headers()).get("referer") || "/";
    redirect(`authentication?callbackUrl=${encodeURIComponent(currentUrl)}`);
  }

  if (!roles.includes(actor.role)) {
    redirect("/not-authorized");
  }

  return session;
}

/** * * @returns random string */ 
export const ulidId = () => ulid();
