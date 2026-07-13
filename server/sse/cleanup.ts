import { sseManager } from "./manager";

export function removeSSE(
  threadId: string,
  clientId: string
) {
  sseManager.remove(
    threadId,
    clientId
  );
}

export function removeThreadSSE(
  threadId: string
) {
  const clients =
    sseManager.getThreadClients(
      threadId
    );

  for (const client of clients.values()) {
    sseManager.remove(
      threadId,
      client.clientId
    );
  }
}

export function clearSSE() {
  sseManager.clear();
}