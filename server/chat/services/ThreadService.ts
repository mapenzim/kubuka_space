import { ThreadRepository } from "../repositories/ThreadRepository";

export class ThreadService {
  constructor(
    private readonly repository =
      new ThreadRepository()
  ) {}

  // =====================================================
  // FIND
  // =====================================================

  async find(
    threadId: string
  ) {
    return this.repository.find(
      threadId
    );
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByEmail(
    email: string
  ) {
    return this.repository.findByEmail(
      email
    );
  }

  // =====================================================
  // CREATE
  // =====================================================

  async findOrCreate(
    sender: string,
    email: string
  ) {
    const existing =
      await this.repository.findByEmail(
        email
      );

    if (existing) {
      return existing;
    }

    return this.repository.create(
      sender,
      email
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  async markUnread(
    threadId: string
  ) {
    return this.repository.updateStatus(
      threadId,
      "unread"
    );
  }

  async markRead(
    threadId: string
  ) {
    return this.repository.updateStatus(
      threadId,
      "read"
    );
  }

  // =====================================================
  // ARCHIVE
  // =====================================================

  async archive(
    threadId: string
  ) {
    return this.repository.archive(
      threadId
    );
  }

  async restore(
    threadId: string
  ) {
    return this.repository.restore(
      threadId
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    threadId: string
  ) {
    return this.repository.delete(
      threadId
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================

  async exists(
    threadId: string
  ) {
    return this.repository.exists(
      threadId
    );
  }

  async touch(
    threadId: string
  ) {
    return this.repository.touch(
      threadId
    );
  }
}

export const threadService =
  new ThreadService();