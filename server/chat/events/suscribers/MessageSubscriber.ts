// server/chat/events/subscribers/MessageSubscriber.ts

import { eventBus } from "../EventBus";
import { EventName } from "../EventNames";

import {
  broadcastToThread,
  broadcastToRole,
} from "@/server/sse";

import {
  toMessageDto,
  toThreadSummary,
} from "@/lib/mappers";
import { threadRepository } from "../../repositories/ThreadRepository";

const ADMIN_INBOX = "__admin_inbox__";

export class MessageSubscriber {
  subscribe() {

    //--------------------------------------------------
    // MESSAGE CREATED
    //--------------------------------------------------

    eventBus.subscribe(
      EventName.MessageCreated,
      async (event) => {

        //------------------------------------------
        // Thread
        //------------------------------------------

        broadcastToThread(
          event.payload.threadId,
          {
            type: "message.created",

            payload: toMessageDto(
              event.payload
            ),
          }
        );

        //------------------------------------------
        // Inbox
        //------------------------------------------

        const thread =
          await threadRepository.find(
            event.payload.threadId
          );

        if (!thread) {
          return;
        }

        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.updated",

            payload: toThreadSummary(
              thread
            ),
          }
        );
      }
    );

    //--------------------------------------------------
    // MESSAGE READ
    //--------------------------------------------------

    eventBus.subscribe(
      EventName.MessageRead,
      async (event) => {

        broadcastToThread(
          event.payload.threadId,
          {
            type: "message.read",

            payload: toMessageDto(
              event.payload
            ),
          }
        );

        const thread =
          await threadRepository.find(
            event.payload.threadId
          );

        if (!thread) {
          return;
        }

        broadcastToRole(
          ADMIN_INBOX,
          "admin",
          {
            type: "thread.read",

            payload: toThreadSummary(
              thread
            ),
          }
        );
      }
    );

    //--------------------------------------------------
    // MESSAGE DELIVERED
    //--------------------------------------------------

    eventBus.subscribe(
      EventName.MessageDelivered,
      (event) => {

        broadcastToThread(
          event.payload.threadId,
          {
            type: "message.delivered",

            payload: toMessageDto(
              event.payload
            ),
          }
        );
      }
    );

    //--------------------------------------------------
    // MESSAGE UPDATED
    //--------------------------------------------------

    eventBus.subscribe(
      EventName.MessageUpdated,
      (event) => {

        broadcastToThread(
          event.payload.threadId,
          {
            type: "message.updated",

            payload: toMessageDto(
              event.payload
            ),
          }
        );
      }
    );

    //--------------------------------------------------
    // MESSAGE DELETED
    //--------------------------------------------------

    eventBus.subscribe(
      EventName.MessageDeleted,
      (event) => {

        broadcastToThread(
          event.payload.threadId,
          {
            type: "message.deleted",

            payload: {
              id: event.payload.id,
            },
          }
        );
      }
    );
  }
}

export const messageSubscriber =
  new MessageSubscriber();