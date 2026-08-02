"use server";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { hash } from "bcryptjs";
import { ulidId } from "@/lib/server-utils";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/roles";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Administrator access required.");
  }
  return session;
}

export async function createUser(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashd = await hash(password, 10);

  const user = await prisma.user.create({
    data: { id: ulidId(), name, email, password: hashd },
  });

  const broadcaster = getBroadcaster();

  // Notify admins only
  broadcaster.publish({
    channel: "admin",
    type: "user:created",
    payload: user,
  });

  // Also notify the public feed (if needed)
  broadcaster.publish({
    channel: "public",
    type: "feed:update",
    payload: { message: `${user.name} just joined!` },
  });

  return user;
}

export async function getAllUsers() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}
