// server/chat/subscribers/SseSubscriber.ts

import {
  MessageCreatedEvent,
  PresenceChangedEvent,
  ThreadArchivedEvent,
  ThreadReadEvent,
  ChatEvent,
} from "../events";

import {
  broadcastToThread,
  broadcastToRole,
} from "@/server/sse/broadcast";

import { directionToRole } from "@/lib/utils";

export async function registerSseSubscriber(
  event: ChatEvent
) {
  switch (event.type) {

    // =====================================================
    // MESSAGE CREATED
    // =====================================================

    case "message.created": {
      const message =
        event as MessageCreatedEvent;

      broadcastToThread(
        message.payload.threadId,
        {
          type: "message",

          payload: {
            id: message.payload.id,

            threadId:
              message.payload.threadId,

            role: directionToRole(
              message.payload.direction
            ),

            direction:
              message.payload.direction,

            content:
              message.payload.content,

            timestamp:
              message.payload.timestamp,
          },
        }
      );

      break;
    }

    // =====================================================
    // THREAD READ
    // =====================================================

    case "thread.read": {
      const thread =
        event as ThreadReadEvent;

      broadcastToThread(
        thread.payload.id,
        {
          type: "thread.read",

          payload: thread.payload,
        }
      );

      break;
    }

    // =====================================================
    // THREAD ARCHIVED
    // =====================================================

    case "thread.archived": {
      const thread =
        event as ThreadArchivedEvent;

      broadcastToThread(
        thread.payload.id,
        {
          type: "thread.archived",

          payload: thread.payload,
        }
      );

      break;
    }

    // =====================================================
    // PRESENCE
    // =====================================================

    case "presence.changed": {
      const presence =
        event as PresenceChangedEvent;

      broadcastToRole(
        presence.payload.threadId,
        "admin",
        {
          type: "presence",

          payload: presence.payload,
        }
      );

      broadcastToRole(
        presence.payload.threadId,
        "user",
        {
          type: "presence",

          payload: presence.payload,
        }
      );

      break;
    }
  }
}
