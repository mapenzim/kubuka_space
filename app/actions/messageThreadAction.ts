"use server";

import { chatGateway } from "@/lib/container/runtime";
import { auth } from "@/auth";

// =====================================================
// THREADS
// =====================================================

export async function getThread(
  threadId: string,
) {
  try {
    const thread =
      await chatGateway.getThread(threadId);

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error("[getThread]", error);

    return {
      success: false,
      thread: null,
    };
  }
}

export async function getThreads() {
  try {
    const threads =
      await chatGateway.getThreads();

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("[getThreads]", error);

    return {
      success: false,
      threads: [],
    };
  }
}

export async function getUserSupportThreads() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return { success: false, threads: [], unreadCount: 0 };

  const summaries = await chatGateway.getThreads();
  const own = summaries.filter((thread) => thread.email.toLowerCase() === email);
  const threads = await Promise.all(own.map(async (summary) => {
    const details = await chatGateway.getThread(summary.id);
    return details;
  }));
  const validThreads = threads.filter(Boolean);
  const unreadCount = validThreads.reduce(
    (count, thread) => count + (thread?.messages.filter((message) => message.senderRole === "admin" && !message.readAt).length ?? 0),
    0,
  );
  return { success: true, threads: validThreads, unreadCount };
}

export async function getUserSupportUnreadCount() {
  const result = await getUserSupportThreads();
  return result.success ? result.unreadCount : 0;
}

export async function markUserSupportRead() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return { success: false };

  const result = await getUserSupportThreads();
  await Promise.all(
    result.threads
      .filter((thread) => thread && thread.messages.some((message) => message.senderRole === "admin" && !message.readAt))
      .map((thread) => thread ? chatGateway.markThreadRead(thread.id) : Promise.resolve()),
  );
  return { success: true };
}

// =====================================================
// THREAD STATE
// =====================================================

export async function markThreadRead(
  threadId: string,
) {
  const session = await auth();
  const thread = await chatGateway.getThread(threadId);
  if (!session?.user?.email || thread?.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return { success: false };
  }
  try {
    await chatGateway.markThreadRead(threadId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[markThreadRead]", error);

    return {
      success: false,
    };
  }
}

export async function archiveThread(
  threadId: string,
) {
  try {
    await chatGateway.archiveThread(threadId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[archiveThread]", error);

    return {
      success: false,
    };
  }
}

export async function deleteThread(
  threadId: string,
) {
  try {
    await chatGateway.deleteThread(threadId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[deleteThread]", error);

    return {
      success: false,
    };
  }
}
