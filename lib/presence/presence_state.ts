import { Presence } from "./presence";

export class PresenceState {
  private readonly threads = new Map<
    string,
    Map<string, Presence>
  >();

  connect(presence: Presence): void {
    let clients = this.threads.get(presence.threadId);

    if (!clients) {
      clients = new Map();
      this.threads.set(presence.threadId, clients);
    }

    clients.set(presence.clientId, presence);
  }

  disconnect(
    threadId: string,
    clientId: string,
  ): void {
    const clients = this.threads.get(threadId);

    if (!clients) {
      return;
    }

    clients.delete(clientId);

    if (clients.size === 0) {
      this.threads.delete(threadId);
    }
  }

  get(
    threadId: string,
    clientId: string,
  ): Presence | undefined {
    return this.threads
      .get(threadId)
      ?.get(clientId);
  }

  getAll(
    threadId: string,
  ): Presence[] {
    return Array.from(
      this.threads.get(threadId)?.values() ?? [],
    );
  }

  isOnline(
    threadId: string,
    clientId: string,
  ): boolean {
    return this.threads
      .get(threadId)
      ?.has(clientId) ?? false;
  }

  touch(
    threadId: string,
    clientId: string,
  ): void {
    const presence = this.get(
      threadId,
      clientId,
    );

    if (!presence) {
      return;
    }

    presence.lastSeen = new Date();
  }
}