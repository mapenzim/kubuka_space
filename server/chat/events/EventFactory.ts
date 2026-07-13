import { Message, Thread } from "@/lib/interfaces";

import { EventName } from "./EventNames";

import {
  BotCancelledEvent,
  BotScheduledEvent,
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

export class EventFactory {

  // =====================================================
  // MESSAGE
  // =====================================================

  static messageCreated(
    message: Message
  ): MessageCreatedEvent {
    return {
      type: EventName.MessageCreated,
      payload: message,
    };
  }

  static messageUpdated(
    message: Message
  ): MessageUpdatedEvent {
    return {
      type: EventName.MessageUpdated,
      payload: message,
    };
  }

  static messageDeleted(
    id: string,
    threadId: string
  ): MessageDeletedEvent {
    return {
      type: EventName.MessageDeleted,
      payload: {
        id,
        threadId,
      },
    };
  }

  static messageDelivered(
    message: Message
  ): MessageDeliveredEvent {
    return {
      type: EventName.MessageDelivered,
      payload: message,
    };
  }

  static messageRead(
    message: Message
  ): MessageReadEvent {
    return {
      type: EventName.MessageRead,
      payload: message,
    };
  }

  // =====================================================
  // THREAD
  // =====================================================

  static threadCreated(
    thread: Thread
  ): ThreadCreatedEvent {
    return {
      type: EventName.ThreadCreated,
      payload: thread,
    };
  }

  static threadUpdated(
    thread: Thread
  ): ThreadUpdatedEvent {
    return {
      type: EventName.ThreadUpdated,
      payload: thread,
    };
  }

  static threadDeleted(
    id: string
  ): ThreadDeletedEvent {
    return {
      type: EventName.ThreadDeleted,
      payload: {
        id,
      },
    };
  }

  static threadArchived(
    thread: Thread
  ): ThreadArchivedEvent {
    return {
      type: EventName.ThreadArchived,
      payload: thread,
    };
  }

  static threadRead(
    thread: Thread
  ): ThreadReadEvent {
    return {
      type: EventName.ThreadRead,
      payload: thread,
    };
  }

  static threadUnread(
    thread: Thread
  ): ThreadUnreadEvent {
    return {
      type: EventName.ThreadUnread,
      payload: thread,
    };
  }

  // =====================================================
  // PRESENCE
  // =====================================================

  static presenceChanged(
    threadId: string,
    role: "user" | "admin" | "bot",
    online: boolean
  ): PresenceChangedEvent {
    return {
      type: EventName.PresenceChanged,
      payload: {
        threadId,
        role,
        online,
      },
    };
  }

  // =====================================================
  // TYPING
  // =====================================================

  static typingStarted(
    threadId: string,
    clientId: string
  ): TypingStartedEvent {
    return {
      type: EventName.TypingStarted,
      payload: {
        threadId,
        clientId,
      },
    };
  }

  static typingStopped(
    threadId: string,
    clientId: string
  ): TypingStoppedEvent {
    return {
      type: EventName.TypingStopped,
      payload: {
        threadId,
        clientId,
      },
    };
  }

  // =====================================================
  // BOT
  // =====================================================

  static botScheduled(
    threadId: string
  ): BotScheduledEvent {
    return {
      type: EventName.BotScheduled,
      payload: {
        threadId,
      },
    };
  }

  static botCancelled(
    threadId: string
  ): BotCancelledEvent {
    return {
      type: EventName.BotCancelled,
      payload: {
        threadId,
      },
    };
  }
}