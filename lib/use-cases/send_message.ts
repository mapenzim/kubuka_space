import { SendMessageRequest } from "../api/types";
import { MessageDto } from "../dto";
import { ConversationEventType } from "../events/conversation/conversation_event_type";
import { ThreadEventType } from "../events/thread/thread_event_type";
import { MessageDtoMapper } from "../mappers/message_dto_mapper";
import { NotificationService } from "../notifications/notification_service";
import { ChatService } from "../services/chat_service";
import { GetThreadSummary } from "./get_thread_summary";

export class SendMessage {
  constructor(
    private readonly chatService: ChatService,
    private readonly getThreadSummary: GetThreadSummary,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(
    request: SendMessageRequest,
  ): Promise<MessageDto> {
    const message =
      await this.chatService.sendMessage(
        request.threadId,
        request.senderRole,
        request.content,
      );

    const dto =
      MessageDtoMapper.toDto(message);
      
    console.log(
      "[SendMessage]",
      "MESSAGE_CREATED",
    );

    this.notificationService.publishThread({
      type:
        ThreadEventType.MESSAGE_CREATED,
      threadId: request.threadId,
      timestamp:
        new Date().toISOString(),
      payload: {
        message: dto,
      },
    });

    const summary =
      await this.getThreadSummary.execute(
        request.threadId,
      );

    if (summary) {
      this.notificationService.publishConversation({
        type:
          ConversationEventType.CONVERSATION_UPDATED,
        timestamp:
          new Date().toISOString(),
        payload: {
          thread: summary,
        },
      });
    }

    return dto;
  }
} 