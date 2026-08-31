import { Message } from "@/lib/interfaces/message";
import { MessageMapper } from "@/lib/mappers/message_mapper";
import { MessageRepository } from "./message_repository";
import { PrismaClient } from "@prisma/client";

export class PrismaMessageRepository implements MessageRepository {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async find(messageId: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return null;
    }

    return MessageMapper.toDomain(message);
  }

  async findByThread(threadId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        threadId,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return MessageMapper.toDomains(messages);
  }

  async create(data: Message): Promise<Message> {
    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          id: data.id,
          threadId: data.threadId,
          senderRole: data.senderRole,
          content: data.content,
          timestamp: data.timestamp,
          readAt: data.readAt,
        },
      }),
      this.prisma.thread.update({
        where: {
          id: data.threadId,
        },
        data: {
          updatedAt: data.timestamp,
        },
      }),
    ]);

    return MessageMapper.toDomain(message);
  }

  async update(message: Message): Promise<Message> {
    const updated = await this.prisma.message.update({
      where: {
        id: message.id,
      },
      data: {
        content: message.content,
        readAt: message.readAt,
      },
    });

    return MessageMapper.toDomain(updated);
  }

  async markRead(messageId: string): Promise<void> {
    await this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async delete(messageId: string): Promise<void> {
    await this.prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  }

  async markThreadRead(
    threadId: string,
  ): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        threadId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }
}
