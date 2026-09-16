"use client";

import { useCallback } from "react";

import { useChatSession } from "@/lib/chat/session";
import { conversationStore } from "@/lib/chat/stores/conversation_store";
import { chatStores } from "@/lib/chat/stores";
import { ThreadEvent } from "@/lib/events/thread/thread_event";
import { ThreadEventType } from "@/lib/events/thread/thread_event_type";
import { useEventStream } from "./use_event_stream";
import { toast } from "sonner";
import { clearGuestChatSession } from "@/lib/chat/client/guest_session";

export function useThreadEvents() {
  const session = useChatSession();
  const { presence, activity } = chatStores;

  //----------------------------------------------------------
  // Dispatch every event to the correct store
  //----------------------------------------------------------
  const handleEvent = useCallback(
    (event: ThreadEvent) => {
      switch (event.type) {
        case ThreadEventType.MESSAGE_CREATED:
          conversationStore.appendMessage(
            event.payload.message,
          );
          break; 

        case ThreadEventType.ACTIVITY_CHANGED:
          activity.setActivity({
            threadId: event.threadId,
            clientId: event.payload.clientId,
            senderRole: event.payload.senderRole,
            activity: event.payload.activity,
          });

          break;

        case ThreadEventType.PRESENCE_CHANGED:
          presence.setPresence({
            clientId: event.payload.clientId,
            threadId: event.threadId,
            role: event.payload.senderRole,
            online: event.payload.online,
            lastSeen: event.timestamp,
          });
          break;

        case ThreadEventType.THREAD_ARCHIVED:
        case ThreadEventType.THREAD_DELETED:
          if (conversationStore.getThread()?.id !== event.threadId) break;

          conversationStore.clear();
          presence.clear();
          activity.clear();
          session.reset();

          if (session.role === "user") {
            clearGuestChatSession();
            toast.info(
              event.type === ThreadEventType.THREAD_ARCHIVED
                ? "This support conversation was archived."
                : "This support conversation was deleted.",
            );
          }
          break;

      }
    },
    [presence, activity, session],
  );

  //----------------------------------------------------------
  // Single SSE connection
  //----------------------------------------------------------

  return useEventStream<ThreadEvent>({
    threadId: session.threadId,
    clientId: session.clientId,
    conversationKey: session.conversationKey,

    onEvent: handleEvent,
  });
}
