export enum EventName {
  // =====================================================
  // MESSAGE EVENTS
  // =====================================================

  MessageCreated = "message.created",

  MessageUpdated = "message.updated",

  MessageDeleted = "message.deleted",

  MessageDelivered = "message.delivered",

  MessageRead = "message.read",

  // =====================================================
  // THREAD EVENTS
  // =====================================================

  ThreadCreated = "thread.created",

  ThreadUpdated = "thread.updated",

  ThreadDeleted = "thread.deleted",

  ThreadArchived = "thread.archived",

  ThreadRead = "thread.read",

  ThreadUnread = "thread.unread",

  // =====================================================
  // PRESENCE EVENTS
  // =====================================================

  PresenceChanged = "presence.changed",

  // =====================================================
  // TYPING EVENTS
  // =====================================================

  TypingStarted = "typing.started",

  TypingStopped = "typing.stopped",

  // =====================================================
  // BOT EVENTS
  // =====================================================

  BotScheduled = "bot.scheduled",

  BotCancelled = "bot.cancelled",
}