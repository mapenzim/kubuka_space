export type Role = "user" | "admin" | "bot";

export type ChatMessageEvent = {
  id: string;
  role: Role;
  content: string;
  timestamp?: Date;
};

export type ClientConnection = {
  threadId: string;
  role: Role;
};

export const clients = new Map<string, ClientConnection>();

// threadId → SSE controller
export const sseConnections = new Map<
  string,
  ReadableStreamDefaultController
>();

// threadId → fallback bot timer
export const pendingTimers = new Map<string, NodeJS.Timeout>();