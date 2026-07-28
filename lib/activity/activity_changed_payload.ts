import { SenderRole } from "../interfaces/sender_role";
import { ActivityType } from "./activity";

export interface ActivityChangedPayload {
  clientId: string;
  senderRole: SenderRole;
  activity: ActivityType;
}