import type { Role } from "@/server/state/chatState";

import { sseManager } from "@/server/sse/manager";

export interface ConnectionInfo {
  clientId: string;

  threadId: string;

  role: Role;

  connectedAt: Date;
}

export class ConnectionManager {

  // =====================================================
  // CONNECTIONS
  // =====================================================

  get(
    threadId: string
  ): ConnectionInfo[] {
    return [
      ...sseManager
        .getThreadClients(threadId)
        .values(),
    ].map((client) => ({
      clientId: client.clientId,

      threadId: client.threadId,

      role: client.role,

      connectedAt: client.connectedAt,
    }));
  }

  getByRole(
    threadId: string,
    role: Role
  ): ConnectionInfo[] {
    return this.get(
      threadId
    ).filter(
      (client) =>
        client.role === role
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  hasConnections(
    threadId: string
  ) {
    return (
      this.count(threadId) > 0
    );
  }

  count(
    threadId?: string
  ) {
    return sseManager.connectionCount(
      threadId
    );
  }

  isOnline(
    threadId: string,
    role?: Role
  ) {
    if (!role) {
      return (
        this.count(threadId) > 0
      );
    }

    return (
      this.getByRole(
        threadId,
        role
      ).length > 0
    );
  }

  // =====================================================
  // DISCONNECT
  // =====================================================

  disconnect(
    threadId: string,
    clientId: string
  ) {
    sseManager.remove(
      threadId,
      clientId
    );
  }

  disconnectThread(
    threadId: string
  ) {
    const clients =
      this.get(threadId);

    for (const client of clients) {
      this.disconnect(
        threadId,
        client.clientId
      );
    }
  }

  disconnectAll() {
    sseManager.clear();
  }

  // =====================================================
  // DEBUG
  // =====================================================

  stats() {
    const state =
      sseManager.getState();

    return {
      threads:
        state.size,

      connections:
        this.count(),
    };
  }
}

export const connectionManager =
  new ConnectionManager();