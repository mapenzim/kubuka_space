import { Activity } from "./activity";

export class ActivityState {
  private readonly threads = new Map<
    string,
    Map<string, Activity>
  >();

  set(activity: Activity): void {
    let clients = this.threads.get(activity.threadId);

    if (!clients) {
      clients = new Map();
      this.threads.set(activity.threadId, clients);
    }

    clients.set(activity.clientId, activity);
  }

  clear(
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
  ): Activity | undefined {
    return this.threads
      .get(threadId)
      ?.get(clientId);
  }

  getAll(
    threadId: string,
  ): Activity[] {
    return Array.from(
      this.threads.get(threadId)?.values() ?? [],
    );
  }
}