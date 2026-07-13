export interface ChatMessage {
  id: string;
  threadId: string;
  direction: "incoming" | "outgoing";
  content: string;
  timestamp: Date;
}