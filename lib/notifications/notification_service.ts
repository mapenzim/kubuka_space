import { EventEmitter } from "node:events";

import { ThreadEvent } from "@/lib/events/thread/thread_event";
import { ThreadEventType } from "@/lib/events/thread/thread_event_type";
import { ConversationEventType } from "@/lib/events/conversation/conversation_event_type";
import { ConversationEvent } from "../events/conversation/conversation_event";

export class NotificationService {
  private readonly threadEmitter =
    new EventEmitter();

  private readonly conversationEmitter =
    new EventEmitter();

  //--------------------------------------------------------
  // Thread Events
  //--------------------------------------------------------

  publishThread(
    event: ThreadEvent,
  ): void {
    this.threadEmitter.emit(
      event.type,
      event,
    );
  }

  subscribeThread(
    type: ThreadEventType,
    listener: (
      event: ThreadEvent,
    ) => void,
  ): () => void {
    this.threadEmitter.on(
      type,
      listener,
    );

    return () =>
      this.threadEmitter.off(
        type,
        listener,
      );
  }

  subscribeAllThread(
    listener: (
      event: ThreadEvent,
    ) => void,
  ): () => void {
    const unsubscribers =
      Object.values(
        ThreadEventType,
      ).map((type) =>
        this.subscribeThread(
          type,
          listener,
        ),
      );

    return () =>
      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe(),
      );
  }

  //--------------------------------------------------------
  // Conversation Events
  //--------------------------------------------------------

  publishConversation(
    event: ConversationEvent,
  ): void {
    this.conversationEmitter.emit(
      event.type,
      event,
    );
  }

  subscribeConversation(
    type: ConversationEventType,
    listener: (
      event: ConversationEvent,
    ) => void,
  ): () => void {
    this.conversationEmitter.on(
      type,
      listener,
    );

    return () =>
      this.conversationEmitter.off(
        type,
        listener,
      );
  }

  subscribeConversationStream(
    listener: (
      event: ConversationEvent,
    ) => void,
  ): () => void {
    const unsubscribers =
      Object.values(
        ConversationEventType,
      ).map((type) =>
        this.subscribeConversation(
          type,
          listener,
        ),
      );

    return () =>
      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe(),
      );
  }
}