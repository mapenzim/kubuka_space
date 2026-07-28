import { ThreadStatus } from "./thread_status";

export interface ThreadSummary {
  id: string;
  sender: string;
  email: string;
  status: ThreadStatus;
  unread: boolean;
  online: boolean;
  archived: boolean;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}
