"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { directionToRole } from "@/lib/utils";

export type ChatRole =
  | "user"
  | "admin"
  | "bot";

export interface ChatMessage {
  id: string;

  threadId: string;

  role: ChatRole;

  direction: "incoming" | "outgoing";

  content: string;

  timestamp: string;
}

interface UseChatOptions {
  threadId?: string;

  role: ChatRole;

  onMessage?: (
    message: ChatMessage
  ) => void;

  onTypingStart?: (
    clientId: string
  ) => void;

  onTypingStop?: (
    clientId: string
  ) => void;

  onPresence?: (
    online: boolean
  ) => void;

  reconnectDelay?: number;
}

export function useChat({
  threadId,
  role,
  onMessage,
  onTypingStart,
  onTypingStop,
  onPresence,
  reconnectDelay = 3000,
}: UseChatOptions) {
  const eventSource =
    useRef<EventSource | null>(
      null
    );

  const reconnectTimer =
    useRef<NodeJS.Timeout | null>(
      null
    );

  const mounted =
    useRef(false);

  const [connected, setConnected] =
    useState(false);

  //--------------------------------------------------------
  // Connect
  //--------------------------------------------------------

  const connect =
    useCallback(() => {
      if (!threadId) {
        return;
      }

      eventSource.current?.close();

      const es =
        new EventSource(
          `/api/chat/stream?threadId=${threadId}&role=${role}`
        );

      eventSource.current = es;

      es.onopen = () => {
        setConnected(true);
      };

      es.onmessage = (
        event
      ) => {
        try {
          const data =
            JSON.parse(
              event.data
            );

          switch (
            data.type
          ) {
            case "connected":
              return;

            case "message":
              onMessage?.({
                id:
                  data.payload.id,

                threadId:
                  data.payload
                    .threadId,

                role:
                  directionToRole(
                    data.payload
                      .direction
                  ),

                direction:
                  data.payload
                    .direction,

                content:
                  data.payload
                    .content,

                timestamp:
                  new Date(
                    data.payload.timestamp
                  ).toISOString(),
              });

              return;

            case "typing.started":
              onTypingStart?.(
                data.payload
                  .clientId
              );

              return;

            case "typing.stopped":
              onTypingStop?.(
                data.payload
                  .clientId
              );

              return;

            case "presence":
              onPresence?.(
                data.payload
                  .online
              );

              return;
          }
        } catch (error) {
          console.error(
            error
          );
        }
      };

      es.onerror = () => {
        setConnected(false);

        es.close();

        if (
          !mounted.current
        ) {
          return;
        }

        reconnectTimer.current =
          setTimeout(
            connect,
            reconnectDelay
          );
      };
    }, [
      threadId,
      role,
      reconnectDelay,
      onMessage,
      onTypingStart,
      onTypingStop,
      onPresence,
    ]);

  //--------------------------------------------------------
  // Lifecycle
  //--------------------------------------------------------

  useEffect(() => {
    mounted.current = true;

    connect();

    return () => {
      mounted.current =
        false;

      reconnectTimer.current &&
        clearTimeout(
          reconnectTimer.current
        );

      eventSource.current?.close();
    };
  }, [connect]);

  //--------------------------------------------------------
  // Send Message
  //--------------------------------------------------------

  async function sendMessage(
    body: Record<
      string,
      unknown
    >
  ) {
    const response =
      await fetch(
        "/api/chat/send",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

    return response.ok;
  }

  //--------------------------------------------------------
  // Typing
  //--------------------------------------------------------

  async function startTyping(
    clientId: string
  ) {
    if (!threadId) {
      return;
    }

    await fetch(
      "/api/chat/typing",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          threadId,

          clientId,

          typing: true,
        }),
      }
    );
  }

  async function stopTyping(
    clientId: string
  ) {
    if (!threadId) {
      return;
    }

    await fetch(
      "/api/chat/typing",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          threadId,

          clientId,

          typing: false,
        }),
      }
    );
  }

  return {
    connected,

    sendMessage,

    startTyping,

    stopTyping,
  };
}