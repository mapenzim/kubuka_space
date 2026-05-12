"use client";

import { useChat } from "@/hooks/sse";
import { useState } from "react";

export default function AdminUI() {
  const { messages, sendMessage } = useChat("admin", "admin");

  const [text, setText] = useState("");
  const [targetUser, setTargetUser] = useState("");

  return (
    <div>
      <input
        placeholder="User ID"
        value={targetUser}
        onChange={(e) => setTargetUser(e.target.value)}
      />

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.from}:</b> {m.text}
          </p>
        ))}
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => sendMessage(text, targetUser)}>
        Reply
      </button>
    </div>
  );
}