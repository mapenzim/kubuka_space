import { ActivityType } from "@/lib/activity/activity";
import { MessageDto } from "@/lib/dto";
import { SenderRole } from "@/lib/interfaces/sender_role";

import { ThreadEventType } from "./thread_event_type";

interface BaseThreadEvent {
  threadId: string;
  timestamp: string;
}

//--------------------------------------------------------
// Connection
//--------------------------------------------------------
export interface ConnectedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.CONNECTED;

  payload: {
    clientId: string;
  };
}

export interface DisconnectedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.DISCONNECTED;

  payload: {
    clientId: string;
  };
}

//--------------------------------------------------------
// Messages
//--------------------------------------------------------
export interface MessageCreatedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.MESSAGE_CREATED;

  payload: {
    message: MessageDto;
  };
}

export interface MessageUpdatedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.MESSAGE_UPDATED;

  payload: {
    message: MessageDto;
  };
}

export interface MessageDeletedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.MESSAGE_DELETED;

  payload: {
    messageId: string;
  };
}

export interface MessageReadEvent
  extends BaseThreadEvent {
  type: ThreadEventType.MESSAGE_READ;

  payload: {
    messageId: string;
    readAt: string;
  };
}

//--------------------------------------------------------
// Presence
//--------------------------------------------------------
export interface PresenceChangedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.PRESENCE_CHANGED;

  payload: {
    clientId: string;
    senderRole: SenderRole;
    online: boolean;
  };
}

//--------------------------------------------------------
// Activity
//--------------------------------------------------------
export interface ActivityChangedEvent
  extends BaseThreadEvent {
  type: ThreadEventType.ACTIVITY_CHANGED;

  payload: {
    clientId: string;
    senderRole: SenderRole;
    activity: ActivityType;
  };
}

//--------------------------------------------------------
// Union
//--------------------------------------------------------
export type ThreadEvent =
  | ConnectedEvent
  | DisconnectedEvent
  | MessageCreatedEvent
  | MessageUpdatedEvent
  | MessageDeletedEvent
  | MessageReadEvent
  | PresenceChangedEvent
  | ActivityChangedEvent;