"use server";

import { revalidatePath } from "next/cache";
// ⚠️ Update this import path to wherever your Prisma client instance lives
import prisma from "@/lib/prisma"; 
import { ulidId } from "@/lib/server-utils";

type ChatEvent =
  | { type: "message"; role: "user" | "admin" | "bot"; content: string }
  | { type: "typing"; role: "admin" }
  
// ------------------------------------------------------------------
// 1. READ: Fetching Data
// ------------------------------------------------------------------

/**
 * Fetch all active threads for the sidebar, ordered by the most recently updated.
 * We include the latest message so you can show a preview snippet in the UI.
 */
export async function getActiveThreads() {
  try {
    const threads = await prisma.thread.findMany({
      where: { archived: false },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1, // Only get the latest message for the sidebar preview
        },
      },
    });
    return { success: true, data: threads };
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return { success: false, error: "Failed to fetch threads" };
  }
}

/**
 * Fetch a specific thread and all its messages for the main chat pane.
 */
export async function getThreadById(threadId: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          orderBy: { timestamp: "asc" }, // Oldest to newest for chat flow
        },
      },
    });
    return { success: true, thread };
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return { success: false, error: "Failed to fetch thread", thread: null };
  }
}

// ------------------------------------------------------------------
// 2. CREATE: Incoming and Outgoing Messages
// ------------------------------------------------------------------

/**
 * Handles a new message from a user (e.g., from your public website contact form).
 * If a thread with their email already exists and isn't archived, it appends to it.
 * Otherwise, it creates a brand new thread.
 */
export async function receiveIncomingMessage(data: { sender: string; email: string; content: string }) {
  try {
    // Try to find an existing active thread for this email
    const thread = await prisma.thread.findFirst({
      where: { email: data.email, archived: false },
    });

    let finalThread;

    if (thread) {
      // Append to existing thread and mark as unread
      finalThread = await prisma.thread.update({
        where: { id: thread.id },
        data: {
          status: "unread",
          updatedAt: new Date(),
          messages: {
            create: {
              id: ulidId(),
              direction: "incoming",
              content: data.content,
            },
          },
        },
        include: { messages: {
          orderBy: { timestamp: "asc" },
        } }, // Include messages to return the updated thread with the new message
      });
    } else {
      // Create a brand new thread
      finalThread = await prisma.thread.create({
        data: {
          id: ulidId(),
          sender: data.sender,
          email: data.email,
          status: "unread",
          messages: {
            create: {
              id: ulidId(),
              direction: "incoming",
              content: data.content,
            },
          },
        },
        include: { messages: {
          orderBy: { timestamp: "asc" }, // Ensure messages are in the correct order
        } }, // Include messages to return the new thread with its message
      });
    }

    revalidatePath("/admin/messages");
    return { success: true, thread: finalThread };
  } catch (error) {
    console.error("Failed to receive message:", error);
    return { success: false, error: "Failed to process incoming message" };
  }
}

/**
 * Handles the Admin replying to a thread.
 * Appends the message, marks the thread as read, and bumps the updatedAt time.
 */
export async function replyToThread(threadId: string, content: string) {
  try {
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        status: "read",
        updatedAt: new Date(),
        messages: {
          create: {
            id: ulidId(),
            direction: "outgoing",
            content: content,
          },
        },
      },
    });

    // NOTE: Here is where you would also trigger an email API 
    // (like Resend or SendGrid) to actually email the user your reply.

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to send reply:", error);
    return { success: false, error: "Failed to send reply" };
  }
}

// Adjust these imports to match your project structure

export async function sendAdminReply(data: { threadId: string; content: string }) {
  try {
    // 1. Sanitize the input
    const safeContent = data.content ? data.content.trim() : "";

    if (!safeContent) {
      return { success: false, error: "Reply content cannot be empty." };
    }

    // 2. Update the thread and inject the new outgoing message
    const updatedThread = await prisma.thread.update({
      where: { id: data.threadId },
      data: {
        // Change the status so the admin knows they've handled it. 
        // (Adjust "replied" to "read" or whatever matches your schema)
        status: "read", 
        messages: {
          create: {
            id: ulidId(), // Safeguard against the NullConstraintViolation we saw earlier
            direction: "outgoing", // "outgoing" means it came from the Admin
            content: safeContent,
          },
        },
      },
      // Return the updated messages array so the client UI can append it
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    // 3. Purge the Next.js router cache for the admin dashboard
    // This ensures the sidebar thread list and active chat update instantly
    revalidatePath("/admin/messages");

    return { success: true, thread: updatedThread };
    
  } catch (error) {
    console.error("Failed to send admin reply:", error);
    return { success: false, error: "Failed to send reply. Please try again." };
  }
}

// ------------------------------------------------------------------
// 3. UPDATE: Managing Thread Status
// ------------------------------------------------------------------

/**
 * Mark a thread as read (e.g., when the admin clicks on it in the UI).
 */
export async function markThreadAsRead(threadId: string) {
  try {
    await prisma.thread.update({
      where: { id: threadId },
      data: { status: "read" },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark as read:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Archive a thread to remove it from the active inbox.
 */
export async function archiveThread(threadId: string) {
  try {
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        status: "archived",
        archived: true,
        dateArchived: new Date(),
      },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to archive thread:", error);
    return { success: false, error: "Failed to archive thread" };
  }
}

// ------------------------------------------------------------------
// 4. DELETE: Removing Data Permanently
// ------------------------------------------------------------------

/**
 * Permanently delete a thread.
 * Because you have `@relation(..., onDelete: Cascade)` in your Prisma schema,
 * this will automatically delete all associated messages.
 */
export async function deleteThread(threadId: string) {
  try {
    await prisma.thread.delete({
      where: { id: threadId },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete thread:", error);
    return { success: false, error: "Failed to delete thread" };
  }
}