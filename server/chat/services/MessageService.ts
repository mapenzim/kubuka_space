import { MessageRepository } from "../repositories/MessageRepository";

export class MessageService {
  constructor(
    private readonly repository =
      new MessageRepository()
  ) {}

  // =====================================================
  // FIND
  // =====================================================

  async find(
    messageId: string
  ) {
    return this.repository.find(
      messageId
    );
  }

  async findByThread(
    threadId: string
  ) {
    return this.repository.findByThread(
      threadId
    );
  }

  async latest(
    threadId: string
  ) {
    return this.repository.latest(
      threadId
    );
  }

  // =====================================================
  // CREATE
  // =====================================================

  async createIncoming(
    threadId: string,
    content: string
  ) {
    const message =
      await this.repository.createIncoming(
        threadId,
        content
      );

    return message;
  }

  async createOutgoing(
    threadId: string,
    content: string
  ) {
    const message =
      await this.repository.createOutgoing(
        threadId,
        content
      );

    return message;
  }

  // =====================================================
  // READ
  // =====================================================

  async markRead(
    messageId: string
  ) {
    return this.repository.markRead(
      messageId
    );
  }

  async markThreadRead(
    threadId: string
  ) {
    return this.repository.markThreadRead(
      threadId
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    messageId: string
  ) {
    return this.repository.delete(
      messageId
    );
  }

  async deleteThreadMessages(
    threadId: string
  ) {
    return this.repository.deleteThreadMessages(
      threadId
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================

  async count(
    threadId: string
  ) {
    return this.repository.count(
      threadId
    );
  }

  async exists(
    messageId: string
  ) {
    return this.repository.exists(
      messageId
    );
  }
}

export const messageService =
  new MessageService();