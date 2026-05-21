import { sseConnections, pendingTimers } from "@/server/state/chatState";

export function cleanupThread(threadId: string) {
  sseConnections.delete(threadId);

  const timer = pendingTimers.get(threadId);
  if (timer) clearTimeout(timer);

  pendingTimers.delete(threadId);
}

export function removeSSE(threadId: string, clientId: string) {
  const threadClients = sseConnections.get(threadId);

  if (!threadClients) return;

  threadClients.delete(clientId);

  if (threadClients.size === 0) {
    sseConnections.delete(threadId);
  }
}