import {
  AuditAction,
  auditService,
} from "@/server/audit";

import {
  ChatEvent,
  MessageCreatedEvent,
  PresenceChangedEvent,
  ThreadArchivedEvent,
  ThreadReadEvent,
  TypingStartedEvent,
  TypingStoppedEvent,
} from "../events";

export async function registerAuditSubscriber(
  event: ChatEvent
) {
  switch (event.type) {

    // =====================================================
    // MESSAGE CREATED
    // =====================================================

    case "message.created": {
      const message =
        event as MessageCreatedEvent;

      await auditService.record({
        action:
          AuditAction.MessageCreated,

        threadId:
          message.payload.threadId,

        entityId:
          message.payload.id,

        metadata: {
          direction:
            message.payload.direction,

          content:
            message.payload.content,
        },

        occurredAt:
          message.payload.timestamp,
      });

      break;
    }

    // =====================================================
    // THREAD READ
    // =====================================================

    case "thread.read": {
      const thread =
        event as ThreadReadEvent;

      await auditService.record({
        action:
          AuditAction.ThreadRead,

        threadId:
          thread.payload.id,

        occurredAt:
          thread.payload.updatedAt,
      });

      break;
    }

    // =====================================================
    // THREAD ARCHIVED
    // =====================================================

    case "thread.archived": {
      const thread =
        event as ThreadArchivedEvent;

      await auditService.record({
        action:
          AuditAction.ThreadArchived,

        threadId:
          thread.payload.id,

        occurredAt:
          thread.payload.dateArchived ??
          thread.payload.updatedAt,
      });

      break;
    }

    // =====================================================
    // TYPING STARTED
    // =====================================================

    case "typing.started": {
      const typing =
        event as TypingStartedEvent;

      await auditService.record({
        action:
          AuditAction.TypingStarted,

        threadId:
          typing.payload.threadId,

        metadata: {
          clientId:
            typing.payload.clientId,
        },

        occurredAt:
          new Date(),
      });

      break;
    }

    // =====================================================
    // TYPING STOPPED
    // =====================================================

    case "typing.stopped": {
      const typing =
        event as TypingStoppedEvent;

      await auditService.record({
        action:
          AuditAction.TypingStopped,

        threadId:
          typing.payload.threadId,

        metadata: {
          clientId:
            typing.payload.clientId,
        },

        occurredAt:
          new Date(),
      });

      break;
    }

    // =====================================================
    // PRESENCE
    // =====================================================

    case "presence.changed": {
      const presence =
        event as PresenceChangedEvent;

      await auditService.record({
        action:
          AuditAction.PresenceChanged,

        threadId:
          presence.payload.threadId,

        metadata: {
          role:
            presence.payload.role,

          online:
            presence.payload.online,
        },

        occurredAt:
          new Date(),
      });

      break;
    }
  }
}
