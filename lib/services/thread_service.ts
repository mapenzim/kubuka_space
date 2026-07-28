import { Thread } from "@/lib/interfaces/thread";
import { ThreadRepository } from "../repositories/thread_repository";
import { ulidId } from "../server-utils";

export interface CreateThreadRequest {
  sender: string;
  email: string;
  conversationKeyHash: string;
}

export class ThreadService {

  constructor(
    private readonly threadRepository: ThreadRepository,
  ) {}

  async create(
    request: CreateThreadRequest,
  ): Promise<Thread> {

    return this.threadRepository.create({
      id: ulidId(),
      sender: request.sender,
      email: request.email,
      status: 'unread',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversationKeyHash: request.conversationKeyHash,
      dateArchived: null,
      messages: [],
    });
  }

  async getThread(threadId: string) {
    return this.threadRepository.findById(threadId);
  }

  async markThreadRead(
    threadId: string,
  ): Promise<void> {
    await this.threadRepository.markRead(threadId);
  }

  async archiveThread(
    threadId: string,
  ): Promise<void> {
    await this.threadRepository.archive(threadId);
  }

  async deleteThread(
    threadId: string,
  ): Promise<void> {
    await this.threadRepository.delete(threadId);
  }
}
