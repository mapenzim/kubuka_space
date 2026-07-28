import { SenderRole } from "./sender_role";

export interface Message {
  id: string;
  threadId: string;
  senderRole: SenderRole;
  content: string;
  timestamp: Date;
  readAt: Date | null;
}