"use client";

const STORAGE_KEY = "kubuka:guest-chat-session";
const LEGACY_CONVERSATION_KEY_PREFIX = "kubuka:conversation-key:";
const STORAGE_VERSION = 2;

export const USER_CHAT_SIGNED_OUT_EVENT = "kubuka:user-chat-signed-out";

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
  window.localStorage.removeItem(STORAGE_KEY);
}

export function clearUserChatSession() {
  clearGuestChatSession();

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(LEGACY_CONVERSATION_KEY_PREFIX)) {
      window.localStorage.removeItem(key);
    }
  }

  window.dispatchEvent(new Event(USER_CHAT_SIGNED_OUT_EVENT));
}
