import { SenderRole } from "./sender_role";

export interface UIMessage {
  id: string;
  threadId: string;
  senderRole: SenderRole;
  direction:
    | "incoming"
    | "outgoing";
  content: string;
  timestamp: string;
  read: boolean;
}
