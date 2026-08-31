"use client";

import { ConversationClient } from "@/lib/conversation/conversation_client";
import { ConversationEvent } from "@/lib/events/conversation/conversation_event";
import { useEffect, useRef } from "react";

const client = new ConversationClient();

export function useConversationEvents(
  clientId: string,
  onEvent: (event: ConversationEvent) => void,
) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    client.connect(
      clientId,
      {
        onEvent: (event) => onEventRef.current(event),
      },
    );

    return () => {
      client.disconnect();
    };
  }, [clientId]);
}
