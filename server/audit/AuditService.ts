export enum AuditAction {
  MessageCreated = "message.created",

  ThreadRead = "thread.read",

  ThreadArchived = "thread.archived",

  TypingStarted = "typing.started",

  TypingStopped = "typing.stopped",

  PresenceChanged = "presence.changed",
}

export interface AuditRecord {
  action: AuditAction;

  threadId: string;

  entityId?: string;

  metadata?: Record<string, unknown>;

  occurredAt: Date;
}

export class AuditService {
  async record(
    record: AuditRecord
  ) {
    // TODO:
    // Persist to database or external logging service.

    return {
      success: true,
    };
  }

  async records(
    threadId: string
  ) {
    // Placeholder until persistence is added.

    return [];
  }
}

export const auditService =
  new AuditService();
