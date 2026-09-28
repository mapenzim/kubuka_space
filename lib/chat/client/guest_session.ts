"use client";

import { chatStores } from "@/lib/chat/stores";

const STORAGE_KEY = "kubuka:guest-chat-session";
const LEGACY_CONVERSATION_KEY_PREFIX = "kubuka:conversation-key:";
const STORAGE_VERSION = 2;

export const USER_CHAT_SIGNED_OUT_EVENT = "kubuka:user-chat-signed-out";
export const USER_CHAT_SIGNED_OUT_STORAGE_KEY = "kubuka:chat-sign-out";

let sessionRevision = 0;

export function getChatSessionRevision() {
  return sessionRevision;
}

export function clearChatMemory() {
  sessionRevision += 1;
  chatStores.conversation.clear();
  chatStores.presence.clear();
  chatStores.activity.clear();
}

export interface GuestChatSession {
  threadId: string;
  conversationKey: string;
}

interface StoredGuestChatSession extends GuestChatSession {
  owner: "guest";
  version: typeof STORAGE_VERSION;
}

export function getGuestChatSession(): GuestChatSession | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<StoredGuestChatSession>;
    if (
      parsed.owner !== "guest" ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.threadId !== "string" ||
      typeof parsed.conversationKey !== "string"
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { threadId: parsed.threadId, conversationKey: parsed.conversationKey };
  } catch {
    return null;
  }
}

export function saveGuestChatSession(session: GuestChatSession) {
  const storedSession: StoredGuestChatSession = {
    ...session,
    owner: "guest",
    version: STORAGE_VERSION,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession));
}

export function clearGuestChatSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export function clearUserChatSession(broadcast = true) {
  // This must also run when the contact page/provider is not mounted.
  clearChatMemory();
  try {
    clearGuestChatSession();
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(LEGACY_CONVERSATION_KEY_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    }
    if (broadcast) {
      window.localStorage.setItem(USER_CHAT_SIGNED_OUT_STORAGE_KEY, crypto.randomUUID());
    }
  } catch {
    // A storage failure must never prevent sign-out or local cleanup.
  } finally {
    window.dispatchEvent(new Event(USER_CHAT_SIGNED_OUT_EVENT));
  }
}
