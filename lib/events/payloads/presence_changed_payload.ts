import { SenderRole } from "@/lib/interfaces/sender_role";

export interface PresenceChangedPayload {
  clientId: string;
  senderRole: SenderRole;
  online: boolean;
}