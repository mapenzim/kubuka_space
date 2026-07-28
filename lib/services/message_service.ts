import { Message } from "@/lib/interfaces/message";
import { SenderRole } from "../interfaces/sender_role";
import { MessageRepository } from "../repositories/message_repository";
import { ulidId } from "../server-utils";

export interface CreateMessageRequest {
  threadId: string;
  senderRole: SenderRole;
  content: string;
}

export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
  ) {}

  async create(
    request: CreateMessageRequest,
  ): Promise<Message> {
    return this.messageRepository.create({
      id: ulidId(),
      threadId: request.threadId,
      senderRole: request.senderRole,
      content: request.content,
      timestamp: new Date(),
      readAt: null,
    });
  }

  async markRead(
    messageId: string,
  ): Promise<void> {
    await this.messageRepository.markRead(messageId);
  }

  async getThreadMessages(
    threadId: string,
  ): Promise<Message[]> {
    return this.messageRepository.findByThread(threadId);
  }

  async markThreadRead(
    threadId: string,
  ): Promise<void> {
    await this.messageRepository.markThreadRead(
      threadId,
    );
  }
}
