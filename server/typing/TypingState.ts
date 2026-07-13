export interface TypingUser {
  threadId: string;

  clientId: string;

  startedAt: Date;

  expiresAt: Date;
}

class TypingState {
  private readonly typing =
    new Map<
      string,
      Map<string, TypingUser>
    >();

  // =====================================================
  // START
  // =====================================================

  start(
    threadId: string,
    clientId: string,
    timeout = 5000
  ) {
    let clients =
      this.typing.get(
        threadId
      );

    if (!clients) {
      clients =
        new Map();

      this.typing.set(
        threadId,
        clients
      );
    }

    clients.set(
      clientId,
      {
        threadId,

        clientId,

        startedAt:
          new Date(),

        expiresAt:
          new Date(
            Date.now() +
              timeout
          ),
      }
    );
  }

  // =====================================================
  // STOP
  // =====================================================

  stop(
    threadId: string,
    clientId: string
  ) {
    const clients =
      this.typing.get(
        threadId
      );

    if (!clients) {
      return;
    }

    clients.delete(
      clientId
    );

    if (clients.size === 0) {
      this.typing.delete(
        threadId
      );
    }
  }

  // =====================================================
  // REFRESH
  // =====================================================

  refresh(
    threadId: string,
    clientId: string,
    timeout = 5000
  ) {
    const client =
      this.typing
        .get(threadId)
        ?.get(clientId);

    if (!client) {
      this.start(
        threadId,
        clientId,
        timeout
      );

      return;
    }

    client.expiresAt =
      new Date(
        Date.now() +
          timeout
      );
  }

  // =====================================================
  // GET
  // =====================================================

  get(
    threadId: string,
    clientId: string
  ) {
    return this.typing
      .get(threadId)
      ?.get(clientId);
  }

  getThread(
    threadId: string
  ) {
    return [
      ...(
        this.typing.get(
          threadId
        )?.values() ?? []
      ),
    ];
  }

  // =====================================================
  // STATUS
  // =====================================================

  isTyping(
    threadId: string,
    clientId?: string
  ) {
    if (clientId) {
      return this.typing
        .get(threadId)
        ?.has(clientId) ?? false;
    }

    return (
      this.getThread(
        threadId
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

    for (const clients of this.typing.values()) {
      total += clients.size;
    }

    return total;
  }

  // =====================================================
  // CLEANUP
  // =====================================================

  cleanup() {
    const now =
      Date.now();

    for (const [
      threadId,
      clients,
    ] of this.typing) {
      for (const [
        clientId,
        client,
      ] of clients) {
        if (
          client.expiresAt.getTime() <=
          now
        ) {
          clients.delete(
            clientId
          );
        }
      }

      if (clients.size === 0) {
        this.typing.delete(
          threadId
        );
      }
    }
  }

  clearThread(
    threadId: string
  ) {
    this.typing.delete(
      threadId
    );
  }

  clear() {
    this.typing.clear();
  }
}

export const typingState =
  new TypingState();