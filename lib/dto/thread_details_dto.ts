import { ThreadStatus } from "../interfaces";
import { MessageDto } from "./message_dto";

export interface ThreadDetailsDto {
  id: string;
  sender: string;
  email: string;

  status: ThreadStatus;

  archived: boolean;

  conversationKeyHash: string;

  createdAt: string;
  updatedAt: string;

  dateArchived: string | null;

  messages: MessageDto[];
}
