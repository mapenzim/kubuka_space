import type { Role } from "@/server/state/chatState";

import {
  sseManager,
  SseClient,
} from "./manager";

export function registerSSE(
  threadId: string,
  clientId: string,
  role: Role,
  controller: ReadableStreamDefaultController<string>
) {
  const client: SseClient = {
    clientId,

    threadId,

    role,

    controller,

    connectedAt: new Date(),
  };

  sseManager.register(
    threadId,
    client
  );

  return client;
}