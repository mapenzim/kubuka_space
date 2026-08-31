import { ThreadStatus } from "../interfaces/thread_status";
import { MessageDto } from "./message_dto";

export interface ThreadDto {
  id: string;
  sender: string;
  email: string;
  status: ThreadStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  dateArchived: string | null;
  messages: MessageDto[];
}
