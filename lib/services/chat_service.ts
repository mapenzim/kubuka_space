import { SenderRole } from "../interfaces";
import { Thread } from "../interfaces/thread";
import { InboxService } from "./inbox_service";
import { MessageService } from "./message_service";
import { ThreadService } from "./thread_service";

export class ChatService {
  constructor(
    private readonly inboxService: InboxService,
    private readonly threadService: ThreadService,
    private readonly messageService: MessageService,
  ) {}

  async getThread(
    threadId: string,
  ): Promise<Thread | null> {
    return this.inboxService.getThread(threadId);
  }

  async getThreads() {
    return this.inboxService.getThreads();
  }

  async getThreadsByEmail(email: string) {
    return this.threadService.findAllByEmail(email);
  }

  async startConversation(
    sender: string,
    email: string,
    content: string,
    conversationKeyHash: string,
    senderRole: SenderRole = "user",
  ): Promise<Thread> {

    const thread =
      await this.threadService.create({
        sender,
        email,
        conversationKeyHash,
      });

    const message =
      await this.messageService.create({
        threadId: thread.id,
        senderRole,
        content,
      });

    thread.messages.push(message);

    return thread;
  }

  async sendMessage(
    threadId: string,
    senderRole: SenderRole,
    content: string,
  ) {
    return this.messageService.create({
      threadId,
      senderRole,
      content,
    });
  }

  async markThreadRead(
    threadId: string,
  ): Promise<void> {
    const thread =
      await this.threadService.getThread(threadId);

    if (!thread) {
      throw new Error("Thread not found.");
    }

    await this.messageService.markThreadRead(
      threadId,
    );

    await this.threadService.markThreadRead(
      threadId,
    );
  }

  async archiveThread(
    threadId: string,
  ): Promise<void> {
    const thread =
      await this.threadService.getThread(threadId);

    if (!thread) {
      throw new Error("Thread not found.");
    }

    await this.threadService.archiveThread(threadId);
  }

  async deleteThread(
    threadId: string,
  ): Promise<void> {
    const thread =
      await this.threadService.getThread(threadId);

    if (!thread) {
      throw new Error("Thread not found.");
    }

    await this.threadService.deleteThread(threadId);
  }
}
