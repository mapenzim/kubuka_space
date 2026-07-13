import { EventName } from "./EventNames";

import {
  BotCancelledEvent,
  BotScheduledEvent,
  ChatEvent,
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageDeliveredEvent,
  MessageReadEvent,
  MessageUpdatedEvent,
  PresenceChangedEvent,
  ThreadArchivedEvent,
  ThreadCreatedEvent,
  ThreadDeletedEvent,
  ThreadReadEvent,
  ThreadUnreadEvent,
  ThreadUpdatedEvent,
  TypingStartedEvent,
  TypingStoppedEvent,
} from "./EventTypes";

export interface EventMap {
  [EventName.MessageCreated]: MessageCreatedEvent;
  [EventName.MessageUpdated]: MessageUpdatedEvent;
  [EventName.MessageDeleted]: MessageDeletedEvent;
  [EventName.MessageDelivered]: MessageDeliveredEvent;
  [EventName.MessageRead]: MessageReadEvent;

  [EventName.ThreadCreated]: ThreadCreatedEvent;
  [EventName.ThreadUpdated]: ThreadUpdatedEvent;
  [EventName.ThreadDeleted]: ThreadDeletedEvent;
  [EventName.ThreadArchived]: ThreadArchivedEvent;
  [EventName.ThreadRead]: ThreadReadEvent;
  [EventName.ThreadUnread]: ThreadUnreadEvent;

  [EventName.PresenceChanged]: PresenceChangedEvent;

  [EventName.TypingStarted]: TypingStartedEvent;
  [EventName.TypingStopped]: TypingStoppedEvent;

  [EventName.BotScheduled]: BotScheduledEvent;
  [EventName.BotCancelled]: BotCancelledEvent;
}

export type EventHandler<
  K extends keyof EventMap
> = (
  event: EventMap[K]
) => void | Promise<void>;

class EventBus {
  private readonly subscribers = new Map<
    keyof EventMap,
    Set<EventHandler<any>>
  >();

  //----------------------------------------------------
  // Subscribe
  //----------------------------------------------------

  subscribe<
    K extends keyof EventMap
  >(
    event: K,
    handler: EventHandler<K>
  ) {
    if (
      !this.subscribers.has(
        event
      )
    ) {
      this.subscribers.set(
        event,
        new Set()
      );
    }

    this.subscribers
      .get(event)!
      .add(handler);

    return () =>
      this.unsubscribe(
        event,
        handler
      );
  }

  //----------------------------------------------------
  // Unsubscribe
  //----------------------------------------------------

  unsubscribe<
    K extends keyof EventMap
  >(
    event: K,
    handler: EventHandler<K>
  ) {
    this.subscribers
      .get(event)
      ?.delete(handler);
  }

  //----------------------------------------------------
  // Publish
  //----------------------------------------------------

  async publish<
    K extends keyof EventMap
  >(
    event: EventMap[K]
  ) {
    const handlers =
      this.subscribers.get(
        event.type
      );

    if (!handlers) {
      return;
    }

    await Promise.all(
      [...handlers].map(
        async (handler) => {
          try {
            await handler(
              event as never
            );
          } catch (error) {
            console.error(
              `[EventBus] ${event.type}`,
              error
            );
          }
        }
      )
    );
  }

  clear() {
    this.subscribers.clear();
  }

  listenerCount(
    event: keyof EventMap
  ) {
    return (
      this.subscribers.get(
        event
      )?.size ?? 0
    );
  }
}

export const eventBus =
  new EventBus();