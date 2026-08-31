import { MessageDto } from "@/lib/dto";
import { ThreadDetailsDto } from "@/lib/dto/thread_details_dto";

type Listener = () => void;

interface ConversationSnapshot {
  thread?: ThreadDetailsDto;
  messages: MessageDto[];
}

export class ConversationStore {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  private thread?: ThreadDetailsDto;

  private pendingMessages = new Map<string, MessageDto>();

  private snapshotState: ConversationSnapshot =
    {
      thread: undefined,
      messages: [],
    };

  private listeners =
    new Set<Listener>();

  //--------------------------------------------------------
  // React
  //--------------------------------------------------------

  subscribe = (
    listener: Listener,
  ) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.snapshotState = {
      thread: this.thread,
      messages:
        this.thread?.messages ?? [],
    };

    this.listeners.forEach(
      (listener) => listener(),
    );
  }

  snapshot = () =>
    this.snapshotState;

  //--------------------------------------------------------
  // Getters
  //--------------------------------------------------------

  getThread() {
    return this.thread;
  }

  //--------------------------------------------------------
  // Thread
  //--------------------------------------------------------

  setThread(
    thread: ThreadDetailsDto,
  ) {
    const messages = [...thread.messages];
    for (const message of this.pendingMessages.values()) {
      if (
        message.threadId === thread.id &&
        !messages.some((current) => current.id === message.id)
      ) {
        messages.push(message);
      }
      if (message.threadId === thread.id) {
        this.pendingMessages.delete(message.id);
      }
    }

    this.thread = {
      ...thread,
      messages,
    };
    this.notify();
  }

  mergeThread(
    thread: ThreadDetailsDto,
  ) {
    if (!this.thread || this.thread.id !== thread.id) {
      return;
    }

    const messages = new Map(
      this.thread.messages.map((message) => [message.id, message]),
    );

    for (const message of thread.messages) {
      messages.set(message.id, message);
    }

    const merged = {
      ...thread,
      messages: Array.from(messages.values()).sort(
        (left, right) =>
          left.timestamp.localeCompare(right.timestamp) ||
          left.id.localeCompare(right.id),
      ),
    };

    if (JSON.stringify(merged) === JSON.stringify(this.thread)) {
      return;
    }

    this.thread = merged;
    this.notify();
  }

  clear() {
    this.thread = undefined;
    this.pendingMessages.clear();
    this.notify();
  }

  //--------------------------------------------------------
  // Messages
  //--------------------------------------------------------

  appendMessage(
    message: MessageDto,
  ) {
    if (!this.thread) {
      this.pendingMessages.set(message.id, message);
      return;
    }

    if (
      this.thread.messages.some(
        (current) => current.id === message.id,
      )
    ) {
      return;
    }

    this.thread = {
      ...this.thread,
      updatedAt:
        message.timestamp,
      messages: [
        ...this.thread.messages,
        message,
      ],
    };

    this.notify();
  }

  replaceMessages(
    messages: MessageDto[],
  ) {
    if (!this.thread) {
      return;
    }

    this.thread = {
      ...this.thread,
      messages,
    };

    this.notify();
  }

  removeMessage(
    id: string,
  ) {
    if (!this.thread) {
      return;
    }

    this.thread = {
      ...this.thread,
      messages:
        this.thread.messages.filter(
          (m) => m.id !== id,
        ),
    };

    this.notify();
  }

  markRead() {
    if (!this.thread) {
      return;
    }

    this.thread = {
      ...this.thread,
      messages:
        this.thread.messages.map(
          (message) => ({
            ...message,
            readAt:
              message.readAt ??
              new Date().toISOString(),
          }),
        ),
    };

    this.notify();
  }
}

export const conversationStore =
  new ConversationStore();
