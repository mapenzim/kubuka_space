import { SenderRole } from "@/lib/interfaces/sender_role";

export interface TypingPayload {
  clientId: string;
  senderRole: SenderRole;
  typing: boolean;
}