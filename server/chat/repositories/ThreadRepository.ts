// server/chat/repositories/ThreadRepository.ts

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";

export class ThreadRepository {

  // =====================================================
  // FIND
  // =====================================================

  async find(
    threadId: string
  ) {
    return prisma.thread.findUnique({
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
  }

  async findAll() {
    return prisma.thread.findMany({
      where: {
        archived: false,
      },

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  async findArchived() {
    return prisma.thread.findMany({
      where: {
        archived: true,
      },

      orderBy: {
        dateArchived: "desc",
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  async findByEmail(
    email: string
  ) {
    return prisma.thread.findFirst({
      where: {
        email,
        archived: false,
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  // =====================================================
  // CREATE
  // =====================================================

  async create(
    sender: string,
    email: string
  ) {
    return prisma.thread.create({
      data: {
        id: ulidId(),

        sender,

        email,

        status: "unread",
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async updateStatus(
    threadId: string,
    status: "read" | "unread"
  ) {
    return prisma.thread.update({
      where: {
        id: threadId,
      },

      data: {
        status,

        updatedAt: new Date(),
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  async touch(
    threadId: string
  ) {
    return prisma.thread.update({
      where: {
        id: threadId,
      },

      data: {
        updatedAt: new Date(),
      },
    });
  }

  // =====================================================
  // ARCHIVE
  // =====================================================

  async archive(
    threadId: string
  ) {
    return prisma.thread.update({
      where: {
        id: threadId,
      },

      data: {
        archived: true,

        status: "archived",

        dateArchived: new Date(),
      },

      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }

  async restore(
    threadId: string
  ) {
    return prisma.thread.update({
      where: {
        id: threadId,
      },

      data: {
        archived: false,

        status: "read",

        dateArchived: null,
      },
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    threadId: string
  ) {
    return prisma.thread.delete({
      where: {
        id: threadId,
      },
    });
  }

  // =====================================================
  // HELPERS
  // =====================================================

  async exists(
    threadId: string
  ) {
    const count =
      await prisma.thread.count({
        where: {
          id: threadId,
        },
      });

    return count > 0;
  }



  // =====================================================

  // COUNTS

  // =====================================================

  async count() {

    return prisma.thread.count({

      where: {

        archived: false,

      },

    });

  }

  async countUnread() {

    return prisma.thread.count({

      where: {

        archived: false,

        status: "unread",

      },

    });

  }

  async countArchived() {

    return prisma.thread.count({

      where: {

        archived: true,

      },

    });

  }


  // =====================================================

  // SEARCH

  // =====================================================

  async search(

    query: string

  ) {

    return prisma.thread.findMany({

      where: {

        archived: false,

        OR: [

          {

            sender: {

              contains: query,

              mode: "insensitive",

            },

          },

          {

            email: {

              contains: query,

              mode: "insensitive",

            },

          },

          {

            messages: {

              some: {

                content: {

                  contains: query,

                  mode: "insensitive",

                },

              },

            },

          },

        ],

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

    });

  }

  async findUnread() {

    return prisma.thread.findMany({

      where: {

        status: "unread",

        archived: false,

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

    });

  }
}

export const threadRepository =
  new ThreadRepository();
