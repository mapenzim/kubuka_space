import { SenderRole } from "@/lib/interfaces/sender_role";

export interface Presence {
  clientId: string;
  threadId: string;
  senderRole: SenderRole;
  connectedAt: Date;
  lastSeen: Date;
}