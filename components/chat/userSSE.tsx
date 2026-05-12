"use client";

import { useChat } from "@/hooks/sse";
import { useState } from "react";

export default function ChatUI() {
  const userId = "user-" + Math.random().toString(36).slice(2);
  const { messages, sendMessage } = useChat(userId, "user");

  const [text, setText] = useState("");

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.from || m.type}:</b> {m.text}
          </p>
        ))}
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => sendMessage(text)}>Send</button>
    </div>
  );
}