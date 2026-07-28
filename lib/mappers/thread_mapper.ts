import { Thread as PrismaThread, Message as PrismaMessage } from "@prisma/client";
import { Thread } from "../interfaces/thread";
import { MessageMapper } from "./message_mapper";

type PrismaThreadWithMessages = PrismaThread & {
  messages: PrismaMessage[];
};

export class ThreadMapper {
  static toDomain(thread: PrismaThreadWithMessages): Thread {
    return {
      id: thread.id,
      sender: thread.sender,
      email: thread.email,
      status: thread.status,
      archived: thread.archived,
      conversationKeyHash: thread.conversationKeyHash,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      dateArchived: thread.dateArchived,
      messages: thread.messages.map(MessageMapper.toDomain),
    };
  }
}