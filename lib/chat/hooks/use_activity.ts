"use client";

import {
  useCallback,
  useRef,
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

      },
      [session],
    );

  //--------------------------------------------------------
  // Helpers
  //--------------------------------------------------------
  const typingRef = useRef(false);

  const startTyping = useCallback(async () => {
    if (typingRef.current) {
      return;
    }
    typingRef.current = true;
    await setActivity(ActivityType.TYPING);
  }, [setActivity]);

  const stopTyping = useCallback(async () => {
    if (!typingRef.current) {
      return;
    }
    typingRef.current = false;
    await setActivity(ActivityType.IDLE);
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