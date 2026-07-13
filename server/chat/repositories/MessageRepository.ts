import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";

export class MessageRepository {

  // =====================================================
  // FIND
  // =====================================================

  async find(
    messageId: string
  ) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async findByThread(
    threadId: string
  ) {
    return prisma.message.findMany({
      where: {
        threadId,
      },

      orderBy: {
        timestamp: "asc",
      },
    });
  }

  async latest(
    threadId: string
  ) {
    return prisma.message.findFirst({
      where: {
        threadId,
      },

      orderBy: {
        timestamp: "desc",
      },
    });
  }

  // =====================================================
  // CREATE
  // =====================================================

  async createIncoming(
    threadId: string,
    content: string
  ) {
    return prisma.message.create({
      data: {
        id: ulidId(),

        threadId,

        direction: "incoming",

        content,
      },
    });
  }

  async createOutgoing(
    threadId: string,
    content: string
  ) {
    return prisma.message.create({
      data: {
        id: ulidId(),

        threadId,

        direction: "outgoing",

        content,
      },
    });
  }

  // =====================================================
  // READ
  // =====================================================

  async markRead(
    messageId: string
  ) {
    return prisma.message.update({
      where: {
        id: messageId,
      },

      data: {
        readAt: new Date(),
      },
    });
  }

  async markThreadRead(
    threadId: string
  ) {
    return prisma.message.updateMany({
      where: {
        threadId,

        readAt: null,
      },

      data: {
        readAt: new Date(),
      },
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    messageId: string
  ) {
    return prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  }

  async deleteThreadMessages(
    threadId: string
  ) {
    return prisma.message.deleteMany({
      where: {
        threadId,
      },
    });
  }

  // =====================================================
  // HELPERS
  // =====================================================

  async count(
    threadId: string
  ) {
    return prisma.message.count({
      where: {
        threadId,
      },
    });
  }

  async exists(
    messageId: string
  ) {
    const count =
      await prisma.message.count({
        where: {
          id: messageId,
        },
      });

    return count > 0;
  }
}

export const messageRepository =
  new MessageRepository();