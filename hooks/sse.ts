"use client";

import { Thread, UIThread } from "@/lib/interfaces";
import { directionToRole } from "@/lib/utils";
import { useEffect, useState } from "react";

// Mapper function
export function toUIThread(thread: Thread): UIThread {
  return {
    id: thread.id,
    sender: thread.sender,
    email: thread.email,
    messages: thread.messages.map((m) => ({
      id: m.id,
      role: directionToRole(m.direction),
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    })),
  };
}

// Hook
export function useChat(userId: string, role: "user" | "admin" | "bot") {
  const [thread, setThread] = useState<UIThread | null>(null);

  useEffect(() => {
    if (!userId) return;

    const es = new EventSource(`/api/chat/stream?userId=${userId}&role=${role}`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
          const incomingMessage = data.payload;

          setThread((prev) => {
            if (!prev) {
              // initialize thread if null
              return {
                id: userId,
                sender: "",
                email: "",
                messages: [
                  {
                    id: incomingMessage.id,
                    role: directionToRole(incomingMessage.direction),
                    content: incomingMessage.content,
                    timestamp: new Date(incomingMessage.timestamp).toISOString(),
                  },
                ],
              };
            }

            const exists = prev.messages.some((m) => m.id === incomingMessage.id);
            if (exists) return prev;

            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: incomingMessage.id,
                  role: directionToRole(incomingMessage.direction),
                  content: incomingMessage.content,
                  timestamp: new Date(incomingMessage.timestamp).toISOString(),
                },
              ],
            };
          });
        }
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection lost", err);
      es.close();
    };

    return () => es.close();
  }, [userId, role]);

  const sendMessage = async (text: string, targetUserId?: string) => {
    await fetch("/api/chat/send", {
      method: "POST",
      body: JSON.stringify({
        role,
        userId,
        text,
        targetUserId,
      }),
    });
  };

  return {
    thread,
    messages: thread?.messages ?? [],
    sendMessage,
  };
}
