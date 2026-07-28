import { MessageDto } from "../dto";
import { ThreadStatus } from "./thread_status";

export interface UIThread {
  id: string;
  sender: string;
  email: string;
  status: ThreadStatus;
  archived: boolean;
  online: boolean;
  typing: boolean;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages: MessageDto[];
}