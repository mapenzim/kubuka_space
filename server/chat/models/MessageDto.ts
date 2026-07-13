export interface MessageDto {
  id: string;

  threadId: string;

  direction: "incoming" | "outgoing";

  role: "user" | "admin" | "bot";

  content: string;

  timestamp: Date;

  readAt: Date | null;
}