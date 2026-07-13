"use server";

import { chatGateway } from "@/server/chat/ChatGateway";
import { inboxService } from "@/server/inbox/InboxService";

// =====================================================
// USER
// =====================================================

export async function receiveIncomingMessage(
  sender: string,
  email: string,
  content: string
) {
  try {
    const thread =
      await chatGateway.sendUserMessage(
        sender,
        email,
        content
      );

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error(
      "[receiveIncomingMessage]",
      error
    );

    return {
      success: false,
      thread: null,
    };
  }
}

// =====================================================
// ADMIN
// =====================================================

export async function sendAdminReply(
  threadId: string,
  content: string
) {
  try {
    const message =
      await chatGateway.sendAdminMessage(
        threadId,
        content
      );

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error(
      "[sendAdminReply]",
      error
    );

    return {
      success: false,
      message: null,
    };
  }
}

// =====================================================
// THREADS
// =====================================================

export async function getThread(
  threadId: string
) {
  try {
    const thread =
      await chatGateway.getThread(
        threadId
      );

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error(
      "[getThread]",
      error
    );

    return {
      success: false,
      thread: null,
    };
  }
}

export async function getThreads() {
  try {
    const threads =
      await inboxService.getInbox();

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error(
      "[getThreads]",
      error
    );

    return {
      success: false,
      threads: [],
    };
  }
}

export async function findThread(
  email: string
) {
  try {
    const thread =
      await chatGateway.findThread(
        email
      );

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error(
      "[findThread]",
      error
    );

    return {
      success: false,
      thread: null,
    };
  }
}

// =====================================================
// THREAD STATE
// =====================================================

export async function markThreadRead(
  threadId: string
) {
  try {
    await chatGateway.markThreadRead(
      threadId
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[markThreadRead]",
      error
    );

    return {
      success: false,
    };
  }
}

export async function archiveThread(
  threadId: string
) {
  try {
    await chatGateway.archiveThread(
      threadId
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[archiveThread]",
      error
    );

    return {
      success: false,
    };
  }
}

export async function deleteThread(
  threadId: string
) {
  try {
    await chatGateway.deleteThread(
      threadId
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[deleteThread]",
      error
    );

    return {
      success: false,
    };
  }
}
