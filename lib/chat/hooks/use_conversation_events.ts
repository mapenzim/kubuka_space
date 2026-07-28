"use client";

import { ConversationClient } from "@/lib/conversation/conversation_client";
import { useEffect } from "react";

const client = new ConversationClient();

export function useConversationEvents(
  clientId: string,
  onEvent: (event: any) => void,
) {
  useEffect(() => {
    client.connect(
      clientId,
      {
        onEvent,
      },
    );

    return () => {
      client.disconnect();
    };
  }, [clientId]);
}