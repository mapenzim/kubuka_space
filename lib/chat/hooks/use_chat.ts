"use client";

import { useActivity } from "./use_activity";
import { useConversation } from "./use_conversation";
import { usePresence } from "./use_presence";
import { useThreadEvents } from "./use_thread_events";

export function useChat() {
  // Start the realtime connection
  const realtime = useThreadEvents();

  // Domain hooks
  const conversation = useConversation();
  const presence = usePresence();
  const activity = useActivity();

  return {
    // Conversation
    ...conversation,

    // Presence
    ...presence,

    // Activity
    ...activity,

    // Transport
    connected: realtime.connected,
  };
}