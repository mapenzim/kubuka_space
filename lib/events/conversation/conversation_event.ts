import { ThreadSummaryDto } from "@/lib/dto/thread_summary_dto";
import { ConversationEventType } from "./conversation_event_type";

export interface ConversationCreatedEvent {
  type: ConversationEventType.CONVERSATION_CREATED;

  timestamp: string;

  payload: {
    thread: ThreadSummaryDto;
  };
}

export interface ConversationUpdatedEvent {
  type: ConversationEventType.CONVERSATION_UPDATED;

  timestamp: string;

  payload: {
    thread: ThreadSummaryDto;
  };
}

export interface ConversationArchivedEvent {
  type: ConversationEventType.CONVERSATION_ARCHIVED;

  timestamp: string;

  payload: {
    threadId: string;
  };
}

export interface ConversationDeletedEvent {
  type: ConversationEventType.CONVERSATION_DELETED;

  timestamp: string;

  payload: {
    threadId: string;
  };
}

export type ConversationEvent =
  | ConversationCreatedEvent
  | ConversationUpdatedEvent
  | ConversationArchivedEvent
  | ConversationDeletedEvent;