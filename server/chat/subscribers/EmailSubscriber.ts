import { emailService } from "@/server/email/EmailService";
import {
  ChatEvent,
  MessageCreatedEvent,
} from "../events";

export async function registerEmailSubscriber(
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

  // =====================================================
  // CUSTOMER -> ADMIN
  // =====================================================

  if (
    message.payload.direction ===
    "incoming"
  ) {
    await emailService.notifySupport({
      threadId:
        message.payload.threadId,

      messageId:
        message.payload.id,

      content:
        message.payload.content,

      timestamp:
        message.payload.timestamp,
    });

    return;
  }

  // =====================================================
  // ADMIN -> CUSTOMER
  // =====================================================

  await emailService.notifyCustomer({
    threadId:
      message.payload.threadId,

    messageId:
      message.payload.id,

    content:
      message.payload.content,

    timestamp:
      message.payload.timestamp,
  });
}