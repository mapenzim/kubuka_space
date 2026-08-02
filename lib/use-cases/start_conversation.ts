import { ChatService } from "../services/chat_service";
import { ThreadDetailsDtoMapper } from "../mappers/thread_details_dto_mapper";
import { ConversationKeyService } from "../services/conversation_key_service";
import { ThreadDto } from "../dto";

interface StartConversationRequest {
  sender: string;
  email: string;
  content: string;
  conversationKey?: string;
  senderRole?: "user" | "admin" | "bot";
}

export class StartConversation {
  constructor(
    private readonly chatService: ChatService,
    private readonly conversationKeyService: ConversationKeyService
  ) {}

  async execute(
    request: StartConversationRequest,
  ): Promise<ThreadDto> {
    const conversationKey =
      request.conversationKey ??
      this.conversationKeyService.generate();

    if (request.conversationKey) {
      const existingThreads =
        await this.chatService.getThreadsByEmail(request.email);

      for (const existingThread of existingThreads) {
        if (await this.conversationKeyService.verify(
          conversationKey,
          existingThread.conversationKeyHash,
        )) {
          const message = await this.chatService.sendMessage(
            existingThread.id,
            request.senderRole ?? "user",
            request.content,
          );

          return ThreadDetailsDtoMapper.toDto({
            ...existingThread,
            messages: [...existingThread.messages, message],
          });
        }
      }
    }

    const conversationKeyHash =
      await this.conversationKeyService.hash(
        conversationKey,
      );

    const thread =
      await this.chatService.startConversation(
        request.sender,
        request.email,
        request.content,
        conversationKeyHash,
        request.senderRole ?? "user",
      );

    return ThreadDetailsDtoMapper.toDto(thread);
  }
}
