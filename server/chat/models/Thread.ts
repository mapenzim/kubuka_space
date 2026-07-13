import { ChatMessage } from "./ChatMessage";

export interface ChatThread {
  id: string;
  sender: string;
  email: string;
  status: string;
  archived: boolean;
  updatedAt: Date;
  messages: ChatMessage[];
}