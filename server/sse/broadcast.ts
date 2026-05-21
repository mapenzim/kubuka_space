import {
  ChatMessageEvent,
  sseConnections,
} from "@/server/state/chatState";

export function broadcastToThread(
  threadId: string,
  payload: ChatMessageEvent
) {
  const threadConnections =
    sseConnections.get(threadId);

  if (!threadConnections) return;

  const data = `data: ${JSON.stringify({
    type: "message",
    payload,
  })}\n\n`;

  for (const [, client] of threadConnections) {
    try {
      client.controller.enqueue(data);
    } catch (err) {
      console.error("SSE enqueue failed", err);
    }
  }
}
