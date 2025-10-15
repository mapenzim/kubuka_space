"use client";

import { useEffect, useState } from "react";

export default function PublicFeed() {
  const [feed, setFeed] = useState<string[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/stream?channel=public");

    source.addEventListener("feed:update", (e) => {
      const data = JSON.parse(e.data);
      setFeed((prev) => [data.message, ...prev]);
    });

    return () => source.close();
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Public Feed</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        {feed.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
