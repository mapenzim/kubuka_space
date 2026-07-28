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

    console.log(
      "[ConversationStore]",
      this.snapshotState.messages.length,
    );

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
    this.thread = thread;
    this.notify();
  }

  clear() {
    this.thread = undefined;
    this.notify();
  }

  //--------------------------------------------------------
  // Messages
  //--------------------------------------------------------

  appendMessage(
    message: MessageDto,
  ) {
    if (!this.thread) {
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