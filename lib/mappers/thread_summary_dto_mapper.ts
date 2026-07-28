import { ThreadSummaryDto } from "../dto/thread_summary_dto";
import { ThreadSummary } from "../interfaces/thread_summary";

export class ThreadSummaryDtoMapper {
  static toDto(
    thread: ThreadSummary,
  ): ThreadSummary {
    return {
      id: thread.id,
      sender: thread.sender,
      email: thread.email,
      status: thread.status,

      unread: thread.unread,
      online: thread.online,
      unreadCount: thread.unreadCount,

      lastMessage: thread.lastMessage,
      lastMessageAt:
        thread.lastMessageAt?.toString() ?? null,
      archived: thread.archived,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };
  }

  static toDtos(
    threads: ThreadSummary[],
  ): ThreadSummaryDto[] {
    return threads.map(this.toDto);
  }
}