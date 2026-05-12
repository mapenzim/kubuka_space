import { sseConnections } from "@/server/state/chatState";

export function registerSSE(threadId: string, controller: ReadableStreamDefaultController) {
  sseConnections.set(threadId, controller);
}

export function removeSSE(threadId: string) {
  sseConnections.delete(threadId);
}