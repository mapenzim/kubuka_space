"use server";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { hash } from "bcryptjs";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashd = await hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashd },
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
