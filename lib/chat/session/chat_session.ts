"use client";

import { SenderRole } from "@/lib/interfaces";
import { createContext } from "react";

export interface ChatSession {
  clientId: string;
  role: SenderRole;

  threadId?: string;
  conversationKey?: string;

  setThreadId(
    threadId?: string,
  ): void;

  setConversationKey(
    key?: string,
  ): void;

  reset(): void;
}

export const ChatSessionContext =
  createContext<ChatSession | null>(
    null,
  );