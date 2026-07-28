import { ActivityType } from "@/lib/activity/activity";
import { SenderRole } from "@prisma/client";

export interface SetActivityRequest {
  threadId: string;
  clientId: string;
  role: SenderRole;
  activity: ActivityType;
}

export interface ActivityApi {
  setActivity(
    request: SetActivityRequest,
  ): Promise<void>;
}