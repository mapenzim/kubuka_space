import { SenderRole } from "../interfaces/sender_role";

export interface MessageDto {
  id: string;
  threadId: string;
  senderRole: SenderRole;
  content: string;
  timestamp: string;
  readAt: string | null;
}