import { broadcastToThread } from "@/server/sse/broadcast";
import { pendingTimers } from "@/server/state/chatState";

export function startFallbackTimer(threadId: string) {
  if (pendingTimers.has(threadId)) return;

  const timer = setTimeout(() => {
    broadcastToThread(threadId, {
      id: crypto.randomUUID(),
      role: "bot",
      content:
        "Admin is taking longer. Here’s some help while you wait...",
      timestamp: new Date(),
    });

    pendingTimers.delete(threadId);
  }, 5 * 60 * 1000);

  pendingTimers.set(threadId, timer);
}

export function clearFallbackTimer(threadId: string) {
  const timer = pendingTimers.get(threadId);

  if (timer) clearTimeout(timer);

  pendingTimers.delete(threadId);
}