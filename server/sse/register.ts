import { sseConnections } from "../state/chatState";

export function registerSSE(
  threadId: string,
  clientId: string,
  controller: ReadableStreamDefaultController,
  role: "user" | "admin" | "bot" = "user"
) {
  let threadClients = sseConnections.get(threadId);

  if (!threadClients) {
    threadClients = new Map();
    sseConnections.set(threadId, threadClients);
  }

  threadClients.set(clientId, {
    controller,
    role,
    clientId,
  });
}