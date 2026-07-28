import { ThreadDto } from "../dto";
import { Thread } from "../interfaces/thread";
import { MessageDtoMapper } from "./message_dto_mapper";

export class ThreadDetailsDtoMapper {
  static toDto(
    thread: Thread,
  ): ThreadDto {
    return {
      id: thread.id,
      sender: thread.sender,
      email: thread.email,

      status: thread.status,

      archived: thread.archived,

      conversationKeyHash:
        thread.conversationKeyHash,

      createdAt:
        thread.createdAt.toISOString(),

      updatedAt:
        thread.updatedAt.toISOString(),

      dateArchived:
        thread.dateArchived?.toISOString() ?? null,

      messages:
        MessageDtoMapper.toDtos(
          thread.messages,
        ),
    };
  }

  static toDtos(
    threads: Thread[],
  ): ThreadDto[] {
    return threads.map((t) => this.toDto(t));
  }
}
