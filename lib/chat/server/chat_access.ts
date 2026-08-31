import "server-only";

import { auth } from "@/auth";
import { conversationKeyService } from "@/lib/container/runtime";
import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";
import { ApiError } from "@/lib/api/api_error";

export type ChatActorRole = "admin" | "user";

async function getActiveSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      status: true,
      role: { select: { name: true } },
    },
  });
}

export async function requireChatAdmin(): Promise<void> {
  const user = await getActiveSessionUser();
  if (
    !user ||
    user.status !== "ACTIVE" ||
    !isAdminRole(user.role?.name)
  ) {
    throw new ApiError("Administrator access required.", 403);
  }
}

export async function authorizeThreadAccess(
  threadId: string,
  conversationKey?: string,
): Promise<ChatActorRole> {
  const [user, thread] = await Promise.all([
    getActiveSessionUser(),
    prisma.thread.findUnique({
      where: { id: threadId },
      select: { email: true, conversationKeyHash: true },
    }),
  ]);

  if (!thread) {
    throw new ApiError("Conversation not found.", 404);
  }

  if (
    user?.status === "ACTIVE" &&
    isAdminRole(user.role?.name)
  ) {
    return "admin";
  }

  if (
    user?.status === "ACTIVE" &&
    user.email.toLowerCase() === thread.email.toLowerCase()
  ) {
    return "user";
  }

  if (
    conversationKey &&
    await conversationKeyService.verify(
      conversationKey,
      thread.conversationKeyHash,
    )
  ) {
    return "user";
  }

  throw new ApiError("You cannot access this conversation.", 403);
}
