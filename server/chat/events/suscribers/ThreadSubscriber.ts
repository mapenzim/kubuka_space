// server/chat/events/subscribers/ThreadSubscriber.ts

import { eventBus } from "../EventBus";
import { EventName } from "../EventNames";

import { broadcastToRole } from "@/server/sse";
import { toThreadSummary } from "@/lib/mappers";

const ADMIN_INBOX = "__admin_inbox__";

export class ThreadSubscriber {
  subscribe() {
    //------------------------------------------------------
    // THREAD CREATED
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadCreated,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.created",
            payload: toThreadSummary(
              event.payload
            ),
          }
        );
      }
    );

    //------------------------------------------------------
    // THREAD UPDATED
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadUpdated,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.updated",
            payload: toThreadSummary(
              event.payload
            ),
          }
        );
      }
    );

    //------------------------------------------------------
    // THREAD READ
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadRead,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.read",
            payload: toThreadSummary(
              event.payload
            ),
          }
        );
      }
    );

    //------------------------------------------------------
    // THREAD UNREAD
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadUnread,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.unread",
            payload: toThreadSummary(
              event.payload
            ),
          }
        );
      }
    );

    //------------------------------------------------------
    // THREAD ARCHIVED
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadArchived,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.archived",
            payload: toThreadSummary(
              event.payload
            ),
          }
        );
      }
    );

    //------------------------------------------------------
    // THREAD DELETED
    //------------------------------------------------------

    eventBus.subscribe(
      EventName.ThreadDeleted,
      (event) => {
        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.deleted",
            payload: {
              id: event.payload.id,
            },
          }
        );
      }
    );
  }
}

export const threadSubscriber =
  new ThreadSubscriber();