"use client";

import { useEffect, useState } from "react";

export default function AdminFeed() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/stream?channel=admin");

    source.addEventListener("user:created", (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => [`👤 New User: ${data.name}`, ...prev]);
    });

    return () => source.close();
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Admin Live Feed</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        {events.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
