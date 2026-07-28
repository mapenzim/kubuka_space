import { MessageService } from "@/lib/services/message_service";

export class MarkMessageRead {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  async execute(
    messageId: string,
  ): Promise<void> {
    await this.messageService.markRead(messageId);
  }
}
