import { Thread } from "../interfaces/thread";
import { ThreadSummary } from "../interfaces/thread_summary";

export interface ThreadRepository {
  find(
    threadId: string,
  ): Promise<Thread | null>;

  findAll(): Promise<Thread[]>;

  findAllByEmail(
    email: string,
  ): Promise<Thread[]>;

  getInbox(): Promise<ThreadSummary[]>;

  getInboxThread(
    threadId: string,
  ): Promise<ThreadSummary | null>;

  create(
    thread: Thread,
  ): Promise<Thread>;

  update(
    thread: Thread,
  ): Promise<Thread>;

  findById(
    threadId: string,
  ): Promise<Thread | null>;

  findByConversationKeyHash(
    conversationKeyHash: string,
  ): Promise<Thread | null>;

  markRead(
    threadId: string,
  ): Promise<void>;

  archive(
    threadId: string,
  ): Promise<void>;

  delete(
    threadId: string,
  ): Promise<void>;
}
