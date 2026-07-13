import { scheduler } from "@/server/scheduler";
import { notificationService } from "./NotificationService";

export class BotService {
  private readonly delay =
    5 * 60 * 1000;

  // =====================================================
  // SCHEDULE
  // =====================================================

  schedule(
    threadId: string
  ) {
    scheduler.schedule(
      `bot:${threadId}`,
      this.delay,
      async () => {
        await notificationService.messageCreated({
          id: crypto.randomUUID(),
          threadId,
          direction: "outgoing",
          content:
            "Our support team is taking a little longer to respond. In the meantime, we're still here and your message has been received.",
          timestamp: new Date(),
          readAt: null,
        });
      }
    );
  }

  // =====================================================
  // CANCEL
  // =====================================================

  cancel(
    threadId: string
  ) {
    scheduler.cancel(
      `bot:${threadId}`
    );
  }

  // =====================================================
  // RESCHEDULE
  // =====================================================

  reschedule(
    threadId: string
  ) {
    this.cancel(threadId);

    this.schedule(threadId);
  }

  // =====================================================
  // STATUS
  // =====================================================

  isScheduled(
    threadId: string
  ) {
    return scheduler.exists(
      `bot:${threadId}`
    );
  }

  // =====================================================
  // REMOVE
  // =====================================================

  clear(
    threadId: string
  ) {
    scheduler.cancel(
      `bot:${threadId}`
    );
  }
}

export const botService =
  new BotService();