import { Message as PrismaMessage } from "@prisma/client";

import { MessageDto } from "../dto";
import { Message } from "../interfaces/message";

export class MessageMapper {

  //--------------------------------------------------------
  // Prisma -> Domain
  //--------------------------------------------------------

  static toDomain(
    message: PrismaMessage,
  ): Message {
    return {
      id: message.id,
      threadId: message.threadId,
      senderRole: message.senderRole,
      content: message.content,
      timestamp: message.timestamp,
      readAt: message.readAt,
    };
  }

  static toDomains(
    messages: PrismaMessage[],
  ): Message[] {
    return messages.map(this.toDomain);
  }

  //--------------------------------------------------------
  // Domain -> DTO
  //--------------------------------------------------------

  static toDto(
    message: Message,
  ): MessageDto {
    return {
      id: message.id,
      threadId: message.threadId,
      senderRole: message.senderRole,
      content: message.content,
      timestamp:
        message.timestamp.toISOString(),
      readAt:
        message.readAt?.toISOString() ??
        null,
    };
  }

  static toDtos(
    messages: Message[],
  ): MessageDto[] {
    return messages.map(this.toDto);
  }
}