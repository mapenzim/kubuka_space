import type { Message, Thread } from "@/lib/interfaces";

import { EventName } from "./EventNames";

// =====================================================
// MESSAGE EVENTS
// =====================================================

export interface MessageCreatedEvent {
  type: EventName.MessageCreated;

  payload: Message;
}

export interface MessageUpdatedEvent {
  type: EventName.MessageUpdated;

  payload: Message;
}

export interface MessageDeletedEvent {
  type: EventName.MessageDeleted;

  payload: {
    id: string;

    threadId: string;
  };
}

export interface MessageDeliveredEvent {
  type: EventName.MessageDelivered;

  payload: Message;
}

export interface MessageReadEvent {
  type: EventName.MessageRead;

  payload: Message;
}

// =====================================================
// THREAD EVENTS
// =====================================================

export interface ThreadCreatedEvent {
  type: EventName.ThreadCreated;

  payload: Thread;
}

export interface ThreadUpdatedEvent {
  type: EventName.ThreadUpdated;

  payload: Thread;
}

export interface ThreadDeletedEvent {
  type: EventName.ThreadDeleted;

  payload: {
    id: string;
  };
}

export interface ThreadArchivedEvent {
  type: EventName.ThreadArchived;

  payload: Thread;
}

export interface ThreadReadEvent {
  type: EventName.ThreadRead;

  payload: Thread;
}

export interface ThreadUnreadEvent {
  type: EventName.ThreadUnread;

  payload: Thread;
}

// =====================================================
// PRESENCE
// =====================================================

export interface PresenceChangedEvent {
  type: EventName.PresenceChanged;

  payload: {
    threadId: string;

    role: "user" | "admin" | "bot";

    online: boolean;
  };
}

// =====================================================
// TYPING
// =====================================================

export interface TypingStartedEvent {
  type: EventName.TypingStarted;

  payload: {
    threadId: string;

    clientId: string;
  };
}

export interface TypingStoppedEvent {
  type: EventName.TypingStopped;

  payload: {
    threadId: string;

    clientId: string;
  };
}

// =====================================================
// BOT
// =====================================================

export interface BotScheduledEvent {
  type: EventName.BotScheduled;

  payload: {
    threadId: string;
  };
}

export interface BotCancelledEvent {
  type: EventName.BotCancelled;

  payload: {
    threadId: string;
  };
}

// =====================================================
// UNION
// =====================================================

export type ChatEvent =
  | MessageCreatedEvent
  | MessageUpdatedEvent
  | MessageDeletedEvent
  | MessageDeliveredEvent
  | MessageReadEvent
  | ThreadCreatedEvent
  | ThreadUpdatedEvent
  | ThreadDeletedEvent
  | ThreadArchivedEvent
  | ThreadReadEvent
  | ThreadUnreadEvent
  | PresenceChangedEvent
  | TypingStartedEvent
  | TypingStoppedEvent
  | BotScheduledEvent
  | BotCancelledEvent;