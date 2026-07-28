export enum ChatEventType {
  MESSAGE_CREATED = "message.created",
  MESSAGE_UPDATED = "message.updated",
  MESSAGE_DELETED = "message.deleted",
  TYPING_STARTED = "typing.started",
  TYPING_STOPPED = "typing.stopped",
  MESSAGE_READ = "message.read",

  THREAD_CREATED = "thread.created",
  THREAD_UPDATED = "thread.updated",
  THREAD_ARCHIVED = "thread.archived",

  PRESENCE_CHANGED = "presence.changed",
  ACTIVITY_CHANGED = "activity.changed",

  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}