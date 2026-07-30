"use client";

import { useCallback } from "react";

import { useChatSession } from "@/lib/chat/session";
import { conversationStore } from "@/lib/chat/stores/conversation_store";
import { chatStores } from "@/lib/chat/stores";
import { ChatEvent } from "@/lib/events/chat_event";
import { ChatEventType } from "@/lib/events/chat_event_type";
import { useEventStream } from "./use_event_stream";

export function useThreadEvents() {
  const session = useChatSession();
  const { presence, activity } = chatStores;

  //----------------------------------------------------------
  // Dispatch every event to the correct store
  //----------------------------------------------------------
  const handleEvent = useCallback(
    (event: ChatEvent) => {
      switch (event.type) {
        case ChatEventType.MESSAGE_CREATED:
          conversationStore.appendMessage(
            event.payload.message,
          );
          break; 

        case ChatEventType.ACTIVITY_CHANGED:
          activity.setActivity({
            clientId: event.payload.clientId,
            senderRole: event.payload.senderRole,
            activity: event.payload.activity,
          });

          break;

        case ChatEventType.ACTIVITY_CHANGED:
          activity.setActivity({
            clientId: event.payload.clientId,
            senderRole: event.payload.senderRole,
            activity: event.payload.activity,
          });
          break;
      }
    },
    [presence, activity],
  );

  //----------------------------------------------------------
  // Single SSE connection
  //----------------------------------------------------------

  return useEventStream<ChatEvent>({
    threadId: session.threadId,
    clientId: session.clientId,

    onEvent: handleEvent,
  });
}
