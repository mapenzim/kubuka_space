"use client";

import { useSyncExternalStore } from "react";

import { useConversationEvents } from "./use_conversation_events";
import { conversationStore } from "@/lib/conversation/conversation_store";

export function useInbox(
  clientId: string,
) {
  useConversationEvents(
    clientId,
    (event) => {
      switch (event.type) {
        case "CONVERSATION_CREATED":
          conversationStore.add(
            event.payload.thread,
          );
          break;

        case "CONVERSATION_UPDATED":
          conversationStore.update(
            event.payload.thread,
          );
          break;

        case "CONVERSATION_ARCHIVED":
          conversationStore.archive(
            event.payload.threadId,
          );
          break;

        case "CONVERSATION_DELETED":
          conversationStore.remove(
            event.payload.threadId,
          );
          break;
      }
    },
  );

  const threads =
    useSyncExternalStore(
      conversationStore.subscribe.bind(
        conversationStore,
      ),
      conversationStore.snapshot.bind(
        conversationStore,
      ),
    );

  return {
    threads,
    replace:
      conversationStore.replace.bind(
        conversationStore,
      ),
  };
}