import { ActivityType } from "@/lib/activity/activity";

export interface ActivityRequestDto {
  threadId: string;
  clientId: string;
  activity: ActivityType;
}