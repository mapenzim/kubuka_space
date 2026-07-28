import { MessageDto } from "../dto";
import { Message } from "../interfaces/message";

export class MessageDtoMapper {
  static toDto(message: Message): MessageDto {
    return {
      id: message.id,
      threadId: message.threadId,
      senderRole: message.senderRole,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      readAt: message.readAt?.toISOString() ?? null,
    };
  }

  static toDtos(messages: Message[]): MessageDto[] {
    return messages.map(this.toDto);
  }
}