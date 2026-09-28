"use server";

import prisma from "@/lib/prisma";
import { getActiveActor } from "@/lib/rbac/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const ADMIN_REAUTH_COOKIE = "kubuka_admin_reauth";
const REAUTH_WINDOW_SECONDS = 15 * 60;

export async function confirmAdminAccess(password: string) {
  const actor = await getActiveActor();
  if (!actor || !hasPermission(actor.role, PERMISSIONS.BLOG_READ_ANY)) {
    return { success: false, message: "Back-office access required." };
  }

  if (!password || password.length > 256) {
    return { success: false, message: "Enter your administrator password." };
  }

  const user = await prisma.user.findUnique({
    where: { id: actor.id },
    select: { password: true },
  });
  if (!user || !(await compare(password, user.password))) {
    return { success: false, message: "The password is incorrect." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_REAUTH_COOKIE, "confirmed", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: REAUTH_WINDOW_SECONDS,
  });
  return { success: true };
}
