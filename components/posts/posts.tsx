"use client";

import { useEffect, useState } from "react";

export default function LiveFeed() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/stream");

    source.addEventListener("post:created", (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [`📝 New Post: ${data.title}`, ...prev]);
    });

    return () => source.close();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Live Feed</h2>
      <ul className="space-y-1">
        {messages.map((msg, i) => (
          <li key={i} className="text-sm text-gray-700">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
