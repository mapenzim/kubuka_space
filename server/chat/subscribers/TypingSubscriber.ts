import {
  ChatEvent,
  TypingStartedEvent,
  TypingStoppedEvent,
} from "../events";

import {
  broadcastToRole,
} from "@/server/sse/broadcast";

export async function registerTypingSubscriber(
  event: ChatEvent
) {
  switch (event.type) {

    // =====================================================
    // TYPING STARTED
    // =====================================================

    case "typing.started": {
      const typing =
        event as TypingStartedEvent;

      broadcastToRole(
        typing.payload.threadId,
        "admin",
        {
          type: "typing.started",

          payload: {
            threadId:
              typing.payload.threadId,

            clientId:
              typing.payload.clientId,
          },
        }
      );

      break;
    }

    // =====================================================
    // TYPING STOPPED
    // =====================================================

    case "typing.stopped": {
      const typing =
        event as TypingStoppedEvent;

      broadcastToRole(
        typing.payload.threadId,
        "admin",
        {
          type: "typing.stopped",

          payload: {
            threadId:
              typing.payload.threadId,

            clientId:
              typing.payload.clientId,
          },
        }
      );

      break;
    }
  }
}