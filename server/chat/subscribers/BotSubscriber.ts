import {
  ChatEvent,
  MessageCreatedEvent,
} from "../events";

import { botService } from "../services/BotService";

export async function registerBotSubscriber(
  event: ChatEvent
) {
  if (
    event.type !==
    "message.created"
  ) {
    return;
  }

  const message =
    event as MessageCreatedEvent;

  // -------------------------------------
  // Customer sent a message
  // Schedule fallback bot
  // -------------------------------------

  if (
    message.payload.direction ===
    "incoming"
  ) {
    botService.schedule(
      message.payload.threadId
    );

    return;
  }

  // -------------------------------------
  // Admin replied
  // Cancel fallback bot
  // -------------------------------------

  botService.cancel(
    message.payload.threadId
  );
}