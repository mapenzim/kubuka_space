export interface ThreadSummary {
  id: string;

  sender: string;

  email: string;

  status: string;

  archived: boolean;

  unread: boolean;

  messageCount: number;

  lastMessage: string | null;

  lastMessageAt: Date | null;

  updatedAt: Date;
}