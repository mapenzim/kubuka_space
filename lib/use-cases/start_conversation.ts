import { ChatService } from "../services/chat_service";
import { ThreadDetailsDtoMapper } from "../mappers/thread_details_dto_mapper";
import { ConversationKeyService } from "../services/conversation_key_service";
import { ThreadDto } from "../dto";

interface StartConversationRequest {
  sender: string;
  email: string;
  content: string;
}

export class StartConversation {
  constructor(
    private readonly chatService: ChatService,
    private readonly conversationKeyService: ConversationKeyService
  ) {}

  async execute(
    request: StartConversationRequest,
  ): Promise<ThreadDto> {
    const conversationKey = this.conversationKeyService.generate();

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
      );

    return ThreadDetailsDtoMapper.toDto(thread);
  }
}
