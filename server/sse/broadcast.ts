import type { Role } from "@/server/state/chatState";

import { sseManager } from "./manager";

// =====================================================
// BROADCAST TO THREAD
// =====================================================

export function broadcastToThread(
  threadId: string,
  event: unknown
) {
  sseManager.send(
    threadId,
    event
  );
}

// =====================================================
// BROADCAST TO ROLE
// =====================================================

export function broadcastToRole(
  threadId: string,
  role: Role,
  event: unknown
) {
  sseManager.sendToRole(
    threadId,
    role,
    event
  );
}

// =====================================================
// BROADCAST TO ALL CLIENTS
// =====================================================

export function broadcastToAll(
  event: unknown
) {
  const threads =
    sseManager.getState();

  for (const threadId of threads.keys()) {
    sseManager.send(
      threadId,
      event
    );
  }
}

// =====================================================
// CONNECTION HELPERS
// =====================================================

export function hasSubscribers(
  threadId: string
) {
  return (
    sseManager.connectionCount(
      threadId
    ) > 0
  );
}

export function totalConnections() {
  return sseManager.connectionCount();
}