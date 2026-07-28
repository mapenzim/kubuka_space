import { ActivityType } from "@/lib/activity/activity";
import { MessageDto } from "@/lib/dto";
import { SenderRole } from "@/lib/interfaces/sender_role";

import { ChatEventType } from "./chat_event_type";

interface BaseChatEvent {
  threadId: string;
  timestamp: string;
}

export interface ConnectedEvent extends BaseChatEvent {
  type: ChatEventType.CONNECTED;

  payload: {
    clientId: string;
  };
}

export interface MessageCreatedEvent extends BaseChatEvent {
  type: ChatEventType.MESSAGE_CREATED;

  payload: {
    message: MessageDto;
  };
}

export interface PresenceChangedEvent extends BaseChatEvent {
  type: ChatEventType.PRESENCE_CHANGED;

  payload: {
    clientId: string;
    senderRole: SenderRole;
    online: boolean;
  };
}

export interface ActivityChangedEvent extends BaseChatEvent {
  type: ChatEventType.ACTIVITY_CHANGED;

  payload: {
    clientId: string;
    senderRole: SenderRole;
    activity: ActivityType;
  };
}

export type ChatEvent =
  | ConnectedEvent
  | MessageCreatedEvent
  | PresenceChangedEvent
  | ActivityChangedEvent
