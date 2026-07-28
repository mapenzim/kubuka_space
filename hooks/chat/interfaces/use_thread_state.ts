import { Dispatch, SetStateAction } from "react";

import { ThreadDto } from "@/lib/dto";
import { ActivityType } from "@/lib/activity/activity";

export interface UseThreadState {
  //--------------------------------------------------------
  // Thread
  //--------------------------------------------------------
  thread: ThreadDto | null;
  setThread: Dispatch<
    SetStateAction<ThreadDto | null>
  >;

  //--------------------------------------------------------
  // Runtime
  //--------------------------------------------------------
  clientId?: string;

  //--------------------------------------------------------
  // Realtime
  //--------------------------------------------------------
  participants: Map<string, boolean>;
  activities: Map<string, ActivityType>;
}