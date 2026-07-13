// lib/mappers/chatMapper.ts

import {
  Message,
  Thread,
  UIMessage,
  UIThread,
} from "@/lib/interfaces";

import {
  MessageDto,
  ThreadDto,
  ThreadSummary,
} from "@/server/chat/models";

import { directionToRole } from "@/lib/utils";

// =====================================================
// UI
// =====================================================

export function toUIMessage(
  message: Message
): UIMessage {
  return {
    id: message.id,

    role: directionToRole(
      message.direction
    ),

    content: message.content,

    timestamp:
      message.timestamp.toISOString(),
  };
}

export function toUIThread(
  thread: Thread
): UIThread {
  return {
    id: thread.id,

    sender: thread.sender,

    email: thread.email,

    messages:
      thread.messages.map(
        toUIMessage
      ),
  };
}

export function toUIThreads(
  threads: Thread[]
): UIThread[] {
  return threads.map(
    toUIThread
  );
}

// =====================================================
// DTO
// =====================================================

export function toMessageDto(
  message: Message
): MessageDto {
  return {
    id: message.id,

    threadId: message.threadId,

    direction:
      message.direction,

    role: directionToRole(
      message.direction
    ),

    content: message.content,

    timestamp:
      message.timestamp,

    readAt:
      message.readAt,
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

    archived:
      thread.archived,

    createdAt:
      thread.createdAt,

    updatedAt:
      thread.updatedAt,

    dateArchived:
      thread.dateArchived,

    messages:
      thread.messages.map(
        toMessageDto
      ),
  };
}

export function toThreadDtos(
  threads: Thread[]
): ThreadDto[] {
  return threads.map(
    toThreadDto
  );
}

// =====================================================
// SUMMARY
// =====================================================

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

    archived:
      thread.archived,

    unread:
      thread.status ===
      "unread",

    messageCount:
      thread.messages.length,

    lastMessage:
      latest?.content ??
      null,

    lastMessageAt:
      latest?.timestamp ??
      null,

    updatedAt:
      thread.updatedAt,
  };
}

export function toThreadSummaries(
  threads: Thread[]
): ThreadSummary[] {
  return threads.map(
    toThreadSummary
  );
}