import { broadcastToThread } from "@/server/sse/broadcast";
import { startFallbackTimer } from "@/server/chat/fallbackBot";

export function handleUserMessage(threadId: string, content: string) {
  // send to admin
  broadcastToThread(threadId, {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: new Date(),
  });

  // start fallback timer (if no admin responds)
  startFallbackTimer(threadId);
}

export function handleAdminMessage(threadId: string, content: string) {
  broadcastToThread(threadId, {
    id: crypto.randomUUID(),
    role: "admin",
    content,
    timestamp: new Date(),
  });
}