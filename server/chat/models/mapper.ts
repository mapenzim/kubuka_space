import {
  Thread,
  Message,
} from "@/lib/interfaces";

import {
  MessageDto,
  ThreadDto,
  ThreadSummary,
} from ".";

export function toMessageDto(
  message: Message
): MessageDto {
  return {
    id: message.id,

    threadId: message.threadId,

    direction: message.direction,

    role:
      message.direction === "incoming"
        ? "user"
        : "admin",

    content: message.content,

    timestamp: message.timestamp,

    readAt: message.readAt,
  };
}

export function toThreadDto(
  thread: Thread
): ThreadDto {
  return {
    id: thread.id,

    sender: thread.sender,

    email: thread.email,

    status: thread.status,

    archived: thread.archived,

    createdAt: thread.createdAt,

    updatedAt: thread.updatedAt,

    dateArchived:
      thread.dateArchived,

    messages:
      thread.messages.map(
        toMessageDto
      ),
  };
}

export function toThreadSummary(
  thread: Thread
): ThreadSummary {
  const latest =
    thread.messages.at(-1);

  return {
    id: thread.id,

    sender: thread.sender,

    email: thread.email,

    status: thread.status,

    archived: thread.archived,

    unread:
      thread.status ===
      "unread",

    messageCount:
      thread.messages.length,

    lastMessage:
      latest?.content ?? null,

    lastMessageAt:
      latest?.timestamp ?? null,

    updatedAt:
      thread.updatedAt,
  };
}