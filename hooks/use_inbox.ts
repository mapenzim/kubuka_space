"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { chatClient } from "@/lib/api/chat_client";

import {
  useSyncExternalStore,
} from "react";

import { ConversationEvent } from "@/lib/events/conversation/conversation_event";
import { conversationStore } from "@/lib/conversation/conversation_store";
import { useConversationEvents } from "@/lib/chat/hooks/use_conversation_events";
import { ConversationEventType } from "@/lib/events/conversation/conversation_event_type";

export function useInbox() {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  const threads =
  useSyncExternalStore(
    conversationStore.subscribe.bind(
      conversationStore,
    ),
    conversationStore.snapshot.bind(
      conversationStore,
    ),
  );

  const [
    selectedThreadId,
    setSelectedThreadId,
  ] = useState<string | null>(null);

  //--------------------------------------------------------
  // Load Inbox
  //--------------------------------------------------------

  const loadInbox = useCallback(async () => {
    const response =
      await chatClient.getThreads();

    conversationStore.replace(
      response.data,
    );

    setSelectedThreadId(previous =>
      previous ??
      response.data[0]?.id ??
      null,
    );
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  //--------------------------------------------------------
  // Event Stream
  //--------------------------------------------------------
  const clientId = "admin";

  const connected = true;

  useConversationEvents(
    clientId,
    (event: ConversationEvent) => {
      switch (event.type) {
        case ConversationEventType.CONVERSATION_CREATED:
          conversationStore.add(
            event.payload.thread,
          );
          break;

        case ConversationEventType.CONVERSATION_UPDATED:
          conversationStore.update(
            event.payload.thread,
          );
          break;

        case ConversationEventType.CONVERSATION_ARCHIVED:
          conversationStore.archive(
            event.payload.threadId,
          );
          break;

        case ConversationEventType.CONVERSATION_DELETED:
          conversationStore.remove(
            event.payload.threadId,
          );
          break;
      }
    },
  );
    
  //--------------------------------------------------------
  // Derived State
  //--------------------------------------------------------

  const unreadCount =
    useMemo(
      () =>
        threads.filter(
          thread =>
            thread.unread,
        ).length,
      [threads],
    );

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    connected,

    threads,
    unreadCount,

    selectedThreadId,
    setSelectedThreadId,

    refresh: loadInbox,
  };
}