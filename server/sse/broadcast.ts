import { sseConnections } from "@/server/state/chatState";
import type { ChatMessageEvent } from "@/server/state/chatState";

export function broadcastToThread(
  threadId: string,
  payload: ChatMessageEvent
) {
  const controller = sseConnections.get(threadId);

  if (!controller) return;

  controller.enqueue(
    `data: ${JSON.stringify({
      type: "message",
      ...payload,
    })}\n\n`
  );
}