import { ThreadSummary } from "@/server/chat/models";

import { toThreadSummaries } from "@/lib/mappers";
import { threadRepository } from "../chat/repositories/ThreadRepository";

export class InboxService {
  // =====================================================
  // LOAD
  // =====================================================

  async getInbox() {
    const threads =
      await threadRepository.findAll();

    return toThreadSummaries(
      threads
    );
  }

  async getArchived() {
    const threads =
      await threadRepository.findArchived();

    return toThreadSummaries(
      threads
    );
  }

  async getUnread() {
    const threads =
      await threadRepository.findUnread();

    return toThreadSummaries(
      threads
    );
  }

  async getThread(
    threadId: string
  ) {
    const thread =
      await threadRepository.find(
        threadId
      );

    if (!thread) {
      return null;
    }

    return thread;
  }

  // =====================================================
  // SEARCH
  // =====================================================

  async search(
    query: string
  ): Promise<ThreadSummary[]> {

    const threads =
      await threadRepository.findAll();

    return toThreadSummaries(
      threads
    );
  }

  // =====================================================
  // COUNTS
  // =====================================================

  async unreadCount() {
    return threadRepository.countUnread();
  }

  async totalCount() {
    return threadRepository.count();
  }

  async archivedCount() {
    return threadRepository.countArchived();
  }
}

export const inboxService =
  new InboxService();