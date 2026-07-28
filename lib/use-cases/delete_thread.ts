import { ChatService } from "../services/chat_service";

export class DeleteThread {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  async execute(
    threadId: string,
  ): Promise<void> {
    await this.chatService.deleteThread(
      threadId,
    );
  }
}