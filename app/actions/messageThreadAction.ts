"use server";

import { chatGateway } from "@/lib/container/runtime";
import { getActiveActor } from "@/lib/rbac/server";
import prisma from "@/lib/prisma";

export async function getUserSupportThreads() {
  const actor = await getActiveActor();
  const email = actor?.email.toLowerCase();
  if (!email) return { success: false, threads: [] };

  const validThreads = await chatGateway.getThreadsByEmail(email, 1);
  return { success: true, threads: validThreads };
}

export async function getUserSupportUnreadCount() {
  const actor = await getActiveActor();
  const email = actor?.email.toLowerCase();
  if (!email) return 0;

  return prisma.message.count({
    where: {
      senderRole: { in: ["admin", "bot"] },
      readAt: null,
      thread: {
        archived: false,
        email: { equals: email, mode: "insensitive" },
      },
    },
  });
}

export async function markUserSupportRead() {
  const actor = await getActiveActor();
  const email = actor?.email.toLowerCase();
  if (!email) return { success: false };

  const now = new Date();
  await prisma.$transaction([
    prisma.message.updateMany({
      where: {
        senderRole: { in: ["admin", "bot"] },
        readAt: null,
        thread: {
          email: { equals: email, mode: "insensitive" },
        },
      },
      data: { readAt: now },
    }),
    prisma.thread.updateMany({
      where: {
        email: { equals: email, mode: "insensitive" },
        archived: false,
      },
      data: { status: "read" },
    }),
  ]);
  return { success: true };
}
