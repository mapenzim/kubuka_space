"use client";

import { useEffect, useState } from "react";

export function useChat(userId: string, role: "user" | "admin") {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const es = new EventSource(
      `/api/chat/stream?userId=${userId}&role=${role}`
    );

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
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

  return { messages, sendMessage };
}