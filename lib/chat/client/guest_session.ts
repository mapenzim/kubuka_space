"use client";

const STORAGE_KEY = "kubuka:guest-chat-session";

export interface GuestChatSession {
  threadId: string;
  conversationKey: string;
}

export function getGuestChatSession(): GuestChatSession | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<GuestChatSession>;
    if (typeof parsed.threadId !== "string" || typeof parsed.conversationKey !== "string") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { threadId: parsed.threadId, conversationKey: parsed.conversationKey };
  } catch {
    return null;
  }
}

export function saveGuestChatSession(session: GuestChatSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearGuestChatSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}
