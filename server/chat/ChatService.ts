import { ThreadService } from "./services/ThreadService";
import { MessageService } from "./services/MessageService";
import { NotificationService } from "./services/NotificationService";
import { BotService } from "./services/BotService";

export class ChatService {
  constructor(
    private readonly threads = new ThreadService(),
    private readonly messages = new MessageService(),
    private readonly notifications = new NotificationService(),
    private readonly bot = new BotService()
  ) {}

  // =====================================================
  // USER
  // =====================================================

  async sendUserMessage(
    sender: string,
    email: string,
    content: string
  ) {
    return this.handleUserMessage(
      sender,
      email,
      content
    );
  }

  // =====================================================
  // ADMIN
  // =====================================================

  async sendAdminMessage(
    threadId: string,
    content: string
  ) {
    return this.handleAdminMessage(
      threadId,
      content
    );
  }

  // =====================================================
  // THREADS
  // =====================================================

  async getThread(
    threadId: string
  ) {
    return this.handleGetThread(
      threadId
    );
  }

  async getThreads() {
    return this.handleGetThreads();
  }

  async findThread(
    email: string
  ) {
    return this.threads.findByEmail(
      email
    );
  }

  async markThreadRead(
    threadId: string
  ) {
    return this.handleMarkRead(
      threadId
    );
  }

  async archiveThread(
    threadId: string
  ) {
    return this.handleArchive(
      threadId
    );
  }

  async deleteThread(
    threadId: string
  ) {
    return this.handleDelete(
      threadId
    );
  }

    // =====================================================
  // PRIVATE
  // =====================================================

  private async handleUserMessage(
    sender: string,
    email: string,
    content: string
  ) {
    const thread =
      await this.threads.findOrCreate(
        sender,
        email
      );

    const message =
      await this.messages.createIncoming(
        thread.id,
        content
      );

    await this.threads.markUnread(
      thread.id
    );

    await this.notifications.messageCreated(
      message
    );

    this.bot.schedule(
      thread.id
    );

    return this.threads.find(
      thread.id
    );
  }

  private async handleAdminMessage(
    threadId: string,
    content: string
  ) {
    const message =
      await this.messages.createOutgoing(
        threadId,
        content
      );

    await this.threads.markRead(
      threadId
    );

    this.bot.cancel(
      threadId
    );

    await this.notifications.messageCreated(
      message
    );

    return message;
  }

    private async handleGetThread(
    threadId: string
  ) {
    return this.threads.find(
      threadId
    );
  }

  private async handleGetThreads() {
    return this.threads.findAll();
  }

  private async handleMarkRead(
    threadId: string
  ) {
    const thread =
      await this.threads.markRead(
        threadId
      );

    await this.notifications.threadRead(
      thread
    );

    return thread;
  }

  private async handleArchive(
    threadId: string
  ) {
    const thread =
      await this.threads.archive(
        threadId
      );

    await this.notifications.threadArchived(
      thread
    );

    return thread;
  }

  private async handleDelete(
    threadId: string
  ) {
    return this.threads.delete(
      threadId
    );
  }
}

export const chatService =
  new ChatService();
