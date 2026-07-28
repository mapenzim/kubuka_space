"use server";

import { chatGateway } from "@/lib/container/runtime";

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

// =====================================================
// THREAD STATE
// =====================================================

export async function markThreadRead(
  threadId: string,
) {
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