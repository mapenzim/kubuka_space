import { ThreadSummaryDto } from "../dto/thread_summary_dto";

type Listener = () => void;

export class ConversationStore {
  private readonly listeners =
    new Set<Listener>();

  private threads: ThreadSummaryDto[] = [];

  private snapshotState =
    this.threads;

  //--------------------------------------------------------
  // Subscription
  //--------------------------------------------------------

  subscribe(
    listener: Listener,
  ): () => void {
    this.listeners.add(listener);

    return () =>
      this.listeners.delete(listener);
  }

  snapshot(): ThreadSummaryDto[] {
    return this.snapshotState;
  }

  private notify(): void {
    this.snapshotState = [...this.threads];

    for (const listener of this.listeners) {
      listener();
    }
  }

  //--------------------------------------------------------
  // Mutations
  //--------------------------------------------------------

  replace(
    threads: ThreadSummaryDto[],
  ): void {
    if (JSON.stringify(threads) === JSON.stringify(this.threads)) {
      return;
    }

    this.threads = [...threads];

    this.notify();
  }

  add(
    thread: ThreadSummaryDto,
  ): void {
    this.threads =
      this.threads.filter(
        (t) => t.id !== thread.id,
      );

    this.threads.unshift(thread);

    this.notify();
  }

  update(
    thread: ThreadSummaryDto,
  ): void {
    this.threads =
      this.threads.filter(
        (t) => t.id !== thread.id,
      );

    this.threads.unshift(thread);

    this.notify();
  }

  archive(
    threadId: string,
  ): void {
    this.threads =
      this.threads.filter(
        (t) => t.id !== threadId,
      );

    this.notify();
  }

  remove(
    threadId: string,
  ): void {
    this.threads =
      this.threads.filter(
        (t) => t.id !== threadId,
      );

    this.notify();
  }
}

export const conversationStore =
  new ConversationStore();
