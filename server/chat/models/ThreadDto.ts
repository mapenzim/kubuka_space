import { MessageDto } from "./MessageDto";

export interface ThreadDto {
  id: string;

  sender: string;

  email: string;

  status: string;

  archived: boolean;

  createdAt: Date;

  updatedAt: Date;

  dateArchived: Date | null;

  messages: MessageDto[];
}