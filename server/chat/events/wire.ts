import { eventBus } from "./EventBus";
import { EventName } from "./EventNames";

import { registerSseSubscriber } from "../subscribers/SseSubscriber";
import { registerTypingSubscriber } from "../subscribers/TypingSubscriber";
import { registerEmailSubscriber } from "../subscribers/EmailSubscriber";
import { registerAuditSubscriber } from "../subscribers/AuditSubscriber";
import { registerBotSubscriber } from "../subscribers";
import { threadSubscriber } from "./suscribers/ThreadSubscriber";
import { messageSubscriber } from "./suscribers/MessageSubscriber";

let wired = false;

/**
 * Registers every event subscriber.
 *
 * Call this ONCE during application startup.
 */
export function wireChatEvents() {
  if (wired) {
    return;
  }

  wired = true;

  threadSubscriber.subscribe();
  messageSubscriber.subscribe();

  // =====================================================
  // MESSAGE EVENTS
  // =====================================================

  eventBus.subscribe(
    EventName.MessageCreated,
    registerSseSubscriber
  );

  eventBus.subscribe(
    EventName.MessageCreated,
    registerBotSubscriber
  );

  eventBus.subscribe(
    EventName.MessageCreated,
    registerEmailSubscriber
  );

  eventBus.subscribe(
    EventName.MessageCreated,
    registerAuditSubscriber
  );

  // =====================================================
  // THREAD EVENTS
  // =====================================================

  eventBus.subscribe(
    EventName.ThreadRead,
    registerSseSubscriber
  );

  eventBus.subscribe(
    EventName.ThreadRead,
    registerAuditSubscriber
  );

  eventBus.subscribe(
    EventName.ThreadArchived,
    registerSseSubscriber
  );

  eventBus.subscribe(
    EventName.ThreadArchived,
    registerAuditSubscriber
  );

  // =====================================================
  // TYPING EVENTS
  // =====================================================

  eventBus.subscribe(
    EventName.TypingStarted,
    registerTypingSubscriber
  );

  eventBus.subscribe(
    EventName.TypingStopped,
    registerTypingSubscriber
  );

  // =====================================================
  // PRESENCE EVENTS
  // =====================================================

  eventBus.subscribe(
    EventName.PresenceChanged,
    registerSseSubscriber
  );
}
