"use client";

import {
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { SenderRole } from "../../interfaces";
import { ChatSessionContext } from "./chat_session";

interface Props {
  role: SenderRole;
  children: ReactNode;
}

export function ChatSessionProvider({
  role,
  children,
}: Props) {
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
