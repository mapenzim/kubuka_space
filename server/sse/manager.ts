import type { Role } from "@/server/state/chatState";

export interface SseClient {
  clientId: string;

  threadId: string;

  role: Role;

  controller: ReadableStreamDefaultController<string>;

  connectedAt: Date;
}

class SseManager {
  private readonly connections =
    new Map<
      string,
      Map<string, SseClient>
    >();

  // =====================================================
  // REGISTER
  // =====================================================

  register(
    threadId: string,
    client: SseClient
  ) {
    let clients =
      this.connections.get(
        threadId
      );

    if (!clients) {
      clients =
        new Map();

      this.connections.set(
        threadId,
        clients
      );
    }

    clients.set(
      client.clientId,
      client
    );
  }

  // =====================================================
  // REMOVE
  // =====================================================

  remove(
    threadId: string,
    clientId: string
  ) {
    const clients =
      this.connections.get(
        threadId
      );

    if (!clients) {
      return;
    }

    clients.delete(
      clientId
    );

    if (clients.size === 0) {
      this.connections.delete(
        threadId
      );
    }
  }

  // =====================================================
  // THREAD CLIENTS
  // =====================================================

  getThreadClients(
    threadId: string
  ) {
    return (
      this.connections.get(
        threadId
      ) ?? new Map()
    );
  }

  // =====================================================
  // ROLE CLIENTS
  // =====================================================

  getRoleClients(
    threadId: string,
    role: Role
  ) {
    return [
      ...this.getThreadClients(
        threadId
      ).values(),
    ].filter(
      (client) =>
        client.role === role
    );
  }

  // =====================================================
  // SEND
  // =====================================================

  send(
    threadId: string,
    payload: unknown
  ) {
    const data =
      `data: ${JSON.stringify(
        payload
      )}\n\n`;

    for (const client of this.getThreadClients(
      threadId
    ).values()) {
      try {
        client.controller.enqueue(
          data
        );
      } catch {
        this.remove(
          threadId,
          client.clientId
        );
      }
    }
  }

  sendToRole(
    threadId: string,
    role: Role,
    payload: unknown
  ) {
    const data =
      `data: ${JSON.stringify(
        payload
      )}\n\n`;

    for (const client of this.getRoleClients(
      threadId,
      role
    )) {
      try {
        client.controller.enqueue(
          data
        );
      } catch {
        this.remove(
          threadId,
          client.clientId
        );
      }
    }
  }

  // =====================================================
  // CONNECTIONS
  // =====================================================

  isConnected(
    threadId: string
  ) {
    return this.connections.has(
      threadId
    );
  }

  connectionCount(
    threadId?: string
  ) {
    if (threadId) {
      return this.getThreadClients(
        threadId
      ).size;
    }

    let total = 0;

    for (const clients of this.connections.values()) {
      total += clients.size;
    }

    return total;
  }

  // =====================================================
  // DEBUG
  // =====================================================

  getState() {
    return this.connections;
  }

  clear() {
    this.connections.clear();
  }
}

export const sseManager =
  new SseManager();

export const sseConnections =
  sseManager.getState();