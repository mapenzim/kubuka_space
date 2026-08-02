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
import { presenceStore } from "@/lib/chat/stores/presence_store";

export function useInbox() {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------
  const summaryThreads =
  useSyncExternalStore(
    conversationStore.subscribe.bind(
      conversationStore,
    ),
    conversationStore.snapshot.bind(
      conversationStore,
    ),
    conversationStore.snapshot.bind(
      conversationStore,
    ),
  );

  const presenceSnapshot = useSyncExternalStore(
    presenceStore.subscribe,
    presenceStore.snapshot,
    presenceStore.snapshot,
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

  const removeThread = useCallback((threadId: string) => {
    conversationStore.remove(threadId);
    setSelectedThreadId((current) =>
      current === threadId ? null : current,
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
        summaryThreads.filter(
          thread =>
            thread.unread,
        ).length,
      [summaryThreads],
    );

  const threads = useMemo(
    () => summaryThreads.map((thread) => ({
      ...thread,
      online: presenceSnapshot.participants.find(
        (participant) =>
          participant.threadId === thread.id &&
          participant.role === "user",
      )?.online ?? false,
    })),
    [summaryThreads, presenceSnapshot],
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
    removeThread,
  };
}
