"use client";

import {
  useCallback,
  useEffect,
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

  const {
    threadId,
    clientId,
    role,
    conversationKey,
  } = useChatSession();

  useEffect(() => {
    const nextExpiry = snapshot.participants
      .filter((participant) => participant.activity === ActivityType.TYPING)
      .reduce<number | null>((earliest, participant) => {
        const expiresAt = new Date(participant.updatedAt).getTime() + 6_000;
        return earliest === null || expiresAt < earliest ? expiresAt : earliest;
      }, null);

    if (nextExpiry === null) return;
    const timer = window.setTimeout(
      () => activity.expireStale(),
      Math.max(0, nextExpiry - Date.now()) + 25,
    );

    return () => window.clearTimeout(timer);
  }, [activity, snapshot.participants]);

  //--------------------------------------------------------
  // Activity
  //--------------------------------------------------------
  const setActivity =
    useCallback(
      async (
        activityType: ActivityType,
      ) => {
        if (
          !threadId
        ) {
          return;
        }

        await activityClient.setActivity(
          {
            threadId:
              threadId,

            clientId:
              clientId,

            role,

            conversationKey,

            activity: activityType,
          },
        );

      },
      [threadId, clientId, role, conversationKey],
    );

  //--------------------------------------------------------
  // Helpers
  //--------------------------------------------------------
  const typingRef = useRef(false);

  const startTyping = useCallback(async () => {
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
    getActivity: (clientId: string) =>
      activity.getActivity(threadId, clientId),
    isTyping: (role: "admin" | "user") =>
      activity.isTyping(threadId, role),
  };

}
