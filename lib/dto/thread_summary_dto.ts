import { ThreadStatus } from "../interfaces";

export interface ThreadSummaryDto {
  id: string;
  sender: string;
  email: string;

  status: ThreadStatus;

  unread: boolean;
  online: boolean;
  unreadCount: number;

  lastMessage: string | null;
  lastMessageAt: string | null;

  archived: boolean;

  createdAt: string;
  updatedAt: string;
}
