import { Message } from "@/lib/interfaces/message";

export interface MessageRepository {
  find(messageId: string): Promise<Message | null>;
  findByThread(threadId: string): Promise<Message[]>;
  create(message: Message): Promise<Message>;
  update(message: Message): Promise<Message>;
  markRead(messageId: string): Promise<void>;
  delete(messageId: string): Promise<void>;
  markThreadRead(threadId: string): Promise<void>;
}