import { ChatService } from "../services/chat_service";

export class ArchiveThread {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  async execute(
    threadId: string,
  ): Promise<void> {
    await this.chatService.archiveThread(
      threadId,
    );
  }
}