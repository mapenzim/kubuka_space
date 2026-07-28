import { SenderRole } from "../interfaces/sender_role";


export const ActivityType = {
  IDLE: "idle",
  TYPING: "typing",
  UPLOADING: 'uploading',
  RECORDING: 'recording'
} as const;

export type ActivityType =
  (typeof ActivityType)[keyof typeof ActivityType];

export interface Activity {
  clientId: string;
  threadId: string;
  senderRole: SenderRole;
  activity: ActivityType;
  updatedAt: Date;
}