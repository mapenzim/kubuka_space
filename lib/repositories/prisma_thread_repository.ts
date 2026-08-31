import { PrismaClient } from "@prisma/client";
import { Thread } from "../interfaces/thread";
import { ThreadMapper } from "../mappers/thread_mapper";
import { ThreadRepository } from "./thread_repository";
import { ThreadSummary } from "../interfaces/thread_summary";

export class PrismaThreadRepository implements ThreadRepository {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async findById(threadId: string): Promise<Thread | null> {
    const thread = await this.prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    return thread ? ThreadMapper.toDomain(thread) : null;
  }

  async findByConversationKeyHash(conversationKeyHash: string): Promise<Thread | null> {
    const thread = await this.prisma.thread.findFirst({
      where: {
        conversationKeyHash,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    return thread ? ThreadMapper.toDomain(thread) : null;
  }

  async getInbox(): Promise<ThreadSummary[]> {
    const inboxThreads = await this.prisma.thread.findMany({
      where: {
        archived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        sender: true,
        email: true,
        status: true,
        archived: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
          select: { content: true, timestamp: true },
        },
        _count: {
          select: {
            messages: {
              where: { senderRole: "user", readAt: null },
            },
          },
        },
      },
    });

    return inboxThreads.map((thread) => ({
      id: thread.id,
      sender: thread.sender,
      email: thread.email,
      status: thread.status,
      unread: thread._count.messages > 0,
      online: false,
      archived: thread.archived,
      unreadCount: thread._count.messages,
      lastMessage: thread.messages[0]?.content ?? null,
      lastMessageAt: thread.messages[0]?.timestamp.toISOString() ?? null,
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString(),
    }));
  }

  async getInboxThread(
    threadId: string,
  ): Promise<ThreadSummary | null> {
    const thread =
      await this.prisma.thread.findUnique({
        where: {
          id: threadId,
        },
        select: {
          id: true,
          sender: true,
          email: true,
          status: true,
          archived: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            orderBy: { timestamp: "desc" },
            take: 1,
            select: { content: true, timestamp: true },
          },
          _count: {
            select: {
              messages: {
                where: { senderRole: "user", readAt: null },
              },
            },
          },
        },
      });

    if (!thread) return null;
    return {
      id: thread.id,
      sender: thread.sender,
      email: thread.email,
      status: thread.status,
      unread: thread._count.messages > 0,
      online: false,
      archived: thread.archived,
      unreadCount: thread._count.messages,
      lastMessage: thread.messages[0]?.content ?? null,
      lastMessageAt: thread.messages[0]?.timestamp.toISOString() ?? null,
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString(),
    };
  }

  async markRead(threadId: string): Promise<void> {
    await this.prisma.thread.update({
      where: {
        id: threadId,
      },
      data: {
        status: "read",
      },
    });
  }

  async find(threadId: string): Promise<Thread | null> {
    const thread = await this.prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!thread) {
      return null;
    }

    return ThreadMapper.toDomain(thread);
  }

  async findAll(): Promise<Thread[]> {
    const threads = await this.prisma.thread.findMany({
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return threads.map(ThreadMapper.toDomain);
  }

  async findAllByEmail(email: string, limit?: number): Promise<Thread[]> {
    const threads = await this.prisma.thread.findMany({
      where: {
        archived: false,
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    return threads.map(ThreadMapper.toDomain);
  }

  async create(data: Thread): Promise<Thread> {
    const thread = await this.prisma.thread.create({
      data: {
        id: data.id,
        sender: data.sender,
        email: data.email,
        status: data.status,
        archived: data.archived,
        conversationKeyHash: data.conversationKeyHash,
        dateArchived: data.dateArchived,
      },
      include: {
        messages: true,
      },
    });

    return ThreadMapper.toDomain(thread);
  }

  async update(thread: Thread): Promise<Thread> {
    const updated = await this.prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        sender: thread.sender,
        email: thread.email,
        status: thread.status,
        archived: thread.archived,
        conversationKeyHash: thread.conversationKeyHash,
        dateArchived: thread.dateArchived,
      },
      include: {
        messages: true,
      },
    });

    return ThreadMapper.toDomain(updated);
  }

  async archive(threadId: string): Promise<void> {
    await this.prisma.thread.update({
      where: {
        id: threadId,
      },
      data: {
        archived: true,
        dateArchived: new Date(),
      },
    });
  }

  async delete(threadId: string): Promise<void> {
    await this.prisma.thread.delete({
      where: {
        id: threadId,
      },
    });
  }
}
