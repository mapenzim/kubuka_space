import prisma from "../prisma";
import { PrismaMessageRepository } from "../repositories/prisma_message_repository";
import { PrismaThreadRepository } from "../repositories/prisma_thread_repository";

export const threadRepository =
  new PrismaThreadRepository(prisma);

export const messageRepository =
  new PrismaMessageRepository(prisma);