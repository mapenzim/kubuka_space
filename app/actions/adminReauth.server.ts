"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const ADMIN_REAUTH_COOKIE = "kubuka_admin_reauth";
const REAUTH_WINDOW_SECONDS = 15 * 60;

export async function confirmAdminAccess(password: string) {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    return { success: false, message: "Administrator access required." };
  }

  if (!password || password.length > 256) {
    return { success: false, message: "Enter your administrator password." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
