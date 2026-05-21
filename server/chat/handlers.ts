import { broadcastToThread } from "@/server/sse/broadcast";
import { startFallbackTimer } from "@/server/chat/fallbackBot";

export function handleUserMessage(
  threadId: string,
  content: string
) {
  broadcastToThread(threadId, {
    id: crypto.randomUUID(),
    direction: "incoming",
    content,
    timestamp: new Date(),
  });

  startFallbackTimer(threadId);
}

export function handleAdminMessage(
  threadId: string,
  content: string
) {
  broadcastToThread(threadId, {
    id: crypto.randomUUID(),
    direction: "outgoing",
    content,
    timestamp: new Date(),
  });
}