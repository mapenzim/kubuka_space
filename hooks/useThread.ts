"use client";

import { useCallback, useState } from "react";

import { UIThread } from "@/lib/interfaces";

import { useChat, ChatMessage } from "./useChat";

interface UseThreadOptions {
  thread?: UIThread | null;

  role: "user" | "admin" | "bot";
}

export function useThread({
  thread: initialThread,
  role,
}: UseThreadOptions) {
  const [thread, setThread] =
    useState<UIThread | null>(
      initialThread ?? null
    );

  const [typing, setTyping] =
    useState(false);

  const [online, setOnline] =
    useState(false);

  //--------------------------------------------------------
  // Append Message
  //--------------------------------------------------------

  const appendMessage =
    useCallback(
      (message: ChatMessage) => {
        setThread((previous) => {
          if (!previous) {
            return previous;
          }

          const exists =
            previous.messages.some(
              (m) =>
                m.id ===
                message.id
            );

          if (exists) {
            return previous;
          }

          return {
            ...previous,

            messages: [
              ...previous.messages,

              {
                id: message.id,

                role: message.role,

                content:
                  message.content,

                timestamp:
                  message.timestamp,
              },
            ],
          };
        });
      },
      []
    );

  //--------------------------------------------------------
  // Chat
  //--------------------------------------------------------

  const {
    connected,

    sendMessage,

    startTyping,

    stopTyping,
  } = useChat({
    threadId:
      thread?.id,

    role,

    onMessage:
      appendMessage,

    onTypingStart() {
      setTyping(true);
    },

    onTypingStop() {
      setTyping(false);
    },

    onPresence(
      isOnline
    ) {
      setOnline(
        isOnline
      );
    },
  });

  //--------------------------------------------------------
  // Replace Thread
  //--------------------------------------------------------

  const replaceThread =
    useCallback(
      (
        value:
          | UIThread
          | null
      ) => {
        setThread(value);
      },
      []
    );

  //--------------------------------------------------------
  // Reset
  //--------------------------------------------------------

  const reset =
    useCallback(() => {
      setThread(null);

      setTyping(false);

      setOnline(false);
    }, []);

  //--------------------------------------------------------
  // Helpers
  //--------------------------------------------------------

  const hasMessages =
    !!thread &&
    thread.messages.length > 0;

  return {
    thread,

    setThread:
      replaceThread,

    reset,

    connected,

    online,

    typing,

    hasMessages,

    sendMessage,

    startTyping,

    stopTyping,
  };
}