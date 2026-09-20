"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";

import { SenderRole } from "../../interfaces";
import {
  clearUserChatSession,
  USER_CHAT_SIGNED_OUT_EVENT,
} from "@/lib/chat/client/guest_session";
import { chatStores } from "@/lib/chat/stores";
import { ChatSessionContext } from "./chat_session";

interface Props {
  role: SenderRole;
  children: ReactNode;
}

export function ChatSessionProvider({
  role,
  children,
}: Props) {
  const { status: authenticationStatus } = useSession();
  const previousAuthenticationStatus = useRef(authenticationStatus);
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

  useEffect(() => {
    const clearChat = () => {
      chatStores.conversation.clear();
      chatStores.presence.clear();
      chatStores.activity.clear();
      reset();
    };

    window.addEventListener(USER_CHAT_SIGNED_OUT_EVENT, clearChat);
    return () => window.removeEventListener(USER_CHAT_SIGNED_OUT_EVENT, clearChat);
  }, [reset]);

  useEffect(() => {
    const previousStatus = previousAuthenticationStatus.current;
    previousAuthenticationStatus.current = authenticationStatus;

    if (
      role === "user" &&
      previousStatus === "authenticated" &&
      authenticationStatus === "unauthenticated"
    ) {
      clearUserChatSession();
    }
  }, [authenticationStatus, role]);

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
