"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";

import { SenderRole } from "../../interfaces";
import {
  clearUserChatSession,
  clearChatMemory,
  clearGuestChatSession,
  USER_CHAT_SIGNED_OUT_EVENT,
  USER_CHAT_SIGNED_OUT_STORAGE_KEY,
} from "@/lib/chat/client/guest_session";
import { ChatSessionContext } from "./chat_session";

interface Props {
  role: SenderRole;
  children: ReactNode;
}

export function ChatSessionProvider({
  role,
  children,
}: Props) {
  const { data: session, status } = useSession();
  const identity = status === "authenticated" && session?.user?.status === "ACTIVE"
    ? `account:${session.user.id}`
    : "guest";

  useEffect(() => {
    if (identity !== "guest") clearGuestChatSession();
  }, [identity]);

  if (status === "loading") return <p role="status">Loading chat…</p>;
  if (role === "admin" && identity === "guest") return null;

  // A different account or guest session must never reuse private component state.
  return (
    <ChatIdentityBoundary key={`${role}:${identity}`} role={role}>
      {children}
    </ChatIdentityBoundary>
  );
}

function ChatIdentityBoundary({ role, children }: Props) {
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    const revoke = () => setRevoked(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === USER_CHAT_SIGNED_OUT_STORAGE_KEY) {
        clearUserChatSession(false);
      }
    };
    window.addEventListener(USER_CHAT_SIGNED_OUT_EVENT, revoke);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(USER_CHAT_SIGNED_OUT_EVENT, revoke);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Unmount private messages and their transports immediately. A new identity
  // gets a fresh provider even when Next keeps the route's server props cached.
  if (revoked) {
    return <p role="status">Chat session ended. Sign in again or refresh to start a new conversation.</p>;
  }

  return (
    <IdentityChatSessionProvider role={role}>
      {children}
    </IdentityChatSessionProvider>
  );
}

function IdentityChatSessionProvider({ role, children }: Props) {
  //--------------------------------------------------------
  // Stable client id
  //--------------------------------------------------------

  const [clientId] = useState(
    () => crypto.randomUUID(),
  );

  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  const [
    threadId,
    setThreadId,
  ] = useState<string>();

  const [
    conversationKey,
    setConversationKey,
  ] = useState<string>();

  //--------------------------------------------------------
  // Reset
  //--------------------------------------------------------

  const reset =
    useCallback(() => {
      setThreadId(
        undefined,
      );

      setConversationKey(
        undefined,
      );
    }, []);

  useEffect(() => () => clearChatMemory(), []);

  //--------------------------------------------------------
  // Context
  //--------------------------------------------------------

  const value =
    useMemo(
      () => ({
        clientId,
        role,

        threadId,
        conversationKey,

        setThreadId,
        setConversationKey,

        reset,
      }),
      [
        role,
        clientId,
        threadId,
        conversationKey,
        reset,
      ],
    );

  //--------------------------------------------------------
  // Render
  //--------------------------------------------------------
  

  return (
    <ChatSessionContext.Provider
      value={value}
    >
      {children}
    </ChatSessionContext.Provider>
  );
}
