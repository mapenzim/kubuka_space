import { sseConnections, pendingTimers } from "@/server/state/chatState";

export function cleanupThread(threadId: string) {
  sseConnections.delete(threadId);

  const timer = pendingTimers.get(threadId);
  if (timer) clearTimeout(timer);

  pendingTimers.delete(threadId);
}