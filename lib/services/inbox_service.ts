import { Thread } from "../interfaces/thread";
import { ThreadSummary } from "../interfaces/thread_summary";
import { ThreadRepository } from "../repositories/thread_repository";

export class InboxService {
  constructor(
    private readonly threadRepository: ThreadRepository,
  ) {}

  async getThread(
    threadId: string,
  ): Promise<Thread | null> {
    return this.threadRepository.find(threadId);
  }

  async getThreadSummary(
    threadId: string,
  ): Promise<ThreadSummary | null> {
    return this.threadRepository.getInboxThread(
      threadId,
    );
  }

  async getThreads(): Promise<ThreadSummary[]> {
    return this.threadRepository.getInbox();
  }
  
}