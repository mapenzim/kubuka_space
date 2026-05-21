export type Role = "user" | "admin" | "bot";

export type MessageDirection =
  | "incoming"
  | "outgoing";

export type ChatMessageEvent = {
  id: string;
  content: string;
  direction?: MessageDirection;
  role?: Role;
  timestamp?: Date;
};

// threadId -> timer
export const pendingTimers = new Map<
  string,
  NodeJS.Timeout
>();

export type SSEClient = {
  controller: ReadableStreamDefaultController;
  role: "user" | "admin" | "bot";
  clientId: string;
};

export const sseConnections = new Map<string, Map<string, SSEClient>>();