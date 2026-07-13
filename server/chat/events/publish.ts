import { ChatEvent } from "./EventTypes";
import { eventBus } from "./EventBus";

/**
 * Publish a single chat event.
 */
export async function publish(
  event: ChatEvent
) {
  await eventBus.publish(
    event
  );
}

/**
 * Publish multiple events in order.
 */
export async function publishAll(
  events: ChatEvent[]
) {
  for (const event of events) {
    await publish(
      event
    );
  }
}