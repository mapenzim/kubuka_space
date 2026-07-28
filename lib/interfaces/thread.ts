import { Message } from "./message";
import { ThreadStatus } from "./thread_status";

export interface Thread {
  id: string;
  sender: string;
  email: string;
  status: ThreadStatus;
  archived: boolean;
  conversationKeyHash: string;
  createdAt: Date;
  updatedAt: Date;
  dateArchived: Date | null;
  messages: Message[];
}