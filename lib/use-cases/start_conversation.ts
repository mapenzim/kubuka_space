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

const AUTOMATIC_REPLY =
  "Thanks for reaching out to Kubuka Space. We’ve received your message and a member of our team will respond as soon as possible.";

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
            updatedAt: message.timestamp,
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

    if ((request.senderRole ?? "user") === "user") {
      const automaticReply =
        await this.chatService.sendMessage(
          thread.id,
          "bot",
          AUTOMATIC_REPLY,
        );

      thread.messages.push(automaticReply);
      thread.updatedAt = automaticReply.timestamp;
    }

    return ThreadDetailsDtoMapper.toDto(thread);
  }
}
