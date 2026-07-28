"use client";

import {
  useCallback,
  useSyncExternalStore,
} from "react";

import {
  activityClient,
} from "@/lib/chat/client";

import {
  useChatSession,
} from "@/lib/chat/session";


import { ActivityType } from "@/lib/activity/activity";
import { chatStores } from "../stores";

const isActivityRole = (
  role: string | undefined,
): role is "user" | "admin" =>
  role === "user" ||
  role === "admin";

export function useActivity() {
  //--------------------------------------------------------
  // 
  //--------------------------------- -----------------------
  const { activity } = chatStores;
  const snapshot = useSyncExternalStore(
    activity.subscribe,
    activity.snapshot,
    activity.snapshot,
  );

  const session = useChatSession();

  //--------------------------------------------------------
  // Activity
  //--------------------------------------------------------
  const setActivity =
    useCallback(
      async (
        activityType: ActivityType,
      ) => {
        if (
          !session.threadId
        ) {
          return;
        }

        await activityClient.setActivity(
          {
            threadId:
              session.threadId,

            clientId:
              session.clientId,

            role: session.role,

            activity: activityType,
          },
        );

        activity.setActivity({
          clientId:
            session.clientId,

          senderRole:
            session.role,

          activity: activityType,
        });
      },
      [session],
    );

  //--------------------------------------------------------
  // Helpers
  //--------------------------------------------------------

  const startTyping =
    useCallback(async () => {
      await setActivity(
        ActivityType.TYPING,
      );
    }, [setActivity]);

  const stopTyping =
    useCallback(async () => {
      await setActivity(
        ActivityType.IDLE,
      );
    }, [setActivity]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------
  return {
    participants: snapshot.participants,

    setActivity,
    startTyping,
    stopTyping,

    getActivity: activity.getActivity.bind(activity),

    isTyping: activity.isTyping.bind(activity),
  };

}