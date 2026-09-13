export enum ThreadEventType {
  //--------------------------------------------------------
  // Messages
  //--------------------------------------------------------
  MESSAGE_CREATED = "message.created",
  MESSAGE_UPDATED = "message.updated",
  MESSAGE_DELETED = "message.deleted",
  MESSAGE_READ = "message.read",

  //--------------------------------------------------------
  // Thread lifecycle
  //--------------------------------------------------------
  THREAD_ARCHIVED = "thread.archived",
  THREAD_DELETED = "thread.deleted",

  //--------------------------------------------------------
  // Presence
  //--------------------------------------------------------
  PRESENCE_CHANGED = "presence.changed",

  //--------------------------------------------------------
  // Activity
  //--------------------------------------------------------
  ACTIVITY_CHANGED = "activity.changed",

  //--------------------------------------------------------
  // Connection
  //--------------------------------------------------------
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}
