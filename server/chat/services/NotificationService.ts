import { EventFactory } from "../events";
import { publish } from "../events/publish";
import type { Thread } from "@/lib/interfaces";

export class NotificationService {

  // =====================================================
  // MESSAGE EVENTS
  // =====================================================

  async messageCreated(
    message: {
      id: string;
      threadId: string;
      direction: "incoming" | "outgoing";
      content: string;
      timestamp: Date;
      readAt: Date | null;
    }
  ) {
    await publish(
      EventFactory.messageCreated(
        message
      )
    );
  }

  // =====================================================
  // THREAD EVENTS
  // =====================================================

  async threadRead(
    thread: Thread
  ) {
    await publish(
      EventFactory.threadRead(
        thread
      )
    );
  }

  async threadArchived(
    thread: Thread
  ) {
    await publish(
      EventFactory.threadArchived(
        thread
      )
    );
  }

  // =====================================================
  // TYPING EVENTS
  // =====================================================

  async typingStarted(
    threadId: string,
    clientId: string
  ) {
    await publish(
      EventFactory.typingStarted(
        threadId,
        clientId
      )
    );
  }

  async typingStopped(
    threadId: string,
    clientId: string
  ) {
    await publish(
      EventFactory.typingStopped(
        threadId,
        clientId
      )
    );
  }

  // =====================================================
  // PRESENCE EVENTS
  // =====================================================

  async presenceChanged(
    threadId: string,
    role: "user" | "admin" | "bot",
    online: boolean
  ) {
    await publish(
      EventFactory.presenceChanged(
        threadId,
        role,
        online
      )
    );
  }
}

export const notificationService =
  new NotificationService();
