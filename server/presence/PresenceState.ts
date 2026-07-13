import type { Role } from "@/server/state/chatState";

export interface Presence {
  threadId: string;

  role: Role;

  clientId: string;

  online: boolean;

  connectedAt: Date;

  lastSeen: Date;
}

class PresenceState {
  private readonly presence =
    new Map<
      string,
      Map<string, Presence>
    >();

  // =====================================================
  // CONNECT
  // =====================================================

  connect(
    threadId: string,
    clientId: string,
    role: Role,
    online: boolean
  ) {
    let clients =
      this.presence.get(
        threadId
      );

    if (!clients) {
      clients =
        new Map();

      this.presence.set(
        threadId,
        clients
      );
    }

    clients.set(
      clientId,
      {
        threadId,

        clientId,

        role: role,

        online: true,

        connectedAt:
          new Date(),

        lastSeen:
          new Date(),
      }
    );
  }

  // =====================================================
  // DISCONNECT
  // =====================================================

  disconnect(
    threadId: string,
    clientId: string
  ) {
    const clients =
      this.presence.get(
        threadId
      );

    if (!clients) {
      return;
    }

    clients.delete(
      clientId
    );

    if (clients.size === 0) {
      this.presence.delete(
        threadId
      );
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================

  heartbeat(
    threadId: string,
    clientId: string
  ) {
    const client =
      this.presence
        .get(threadId)
        ?.get(clientId);

    if (!client) {
      return;
    }

    client.lastSeen =
      new Date();

    client.online = true;
  }

  // =====================================================
  // GET
  // =====================================================

  get(
    threadId: string,
    clientId: string
  ) {
    return this.presence
      .get(threadId)
      ?.get(clientId);
  }

  getThread(
    threadId: string
  ) {
    return [
      ...(
        this.presence.get(
          threadId
        )?.values() ?? []
      ),
    ];
  }

  getRole(
    threadId: string,
    role: Role
  ) {
    return this.getThread(
      threadId
    ).filter(
      (client) =>
        client.role === role
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  isOnline(
    threadId: string,
    role?: Role
  ) {
    if (!role) {
      return (
        this.getThread(
          threadId
        ).length > 0
      );
    }

    return (
      this.getRole(
        threadId,
        role
      ).length > 0
    );
  }

  count(
    threadId?: string
  ) {
    if (threadId) {
      return this.getThread(
        threadId
      ).length;
    }

    let total = 0;

    for (const clients of this.presence.values()) {
      total += clients.size;
    }

    return total;
  }

  // =====================================================
  // REMOVE
  // =====================================================

  clearThread(
    threadId: string
  ) {
    this.presence.delete(
      threadId
    );
  }

  clear() {
    this.presence.clear();
  }
}

export const presenceState =
  new PresenceState();