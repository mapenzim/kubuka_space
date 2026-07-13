import { CommandType } from "./CommandTypes";

export interface SendAdminMessageCommand {
  type: CommandType.SendAdminMessage;

  threadId: string;

  content: string;
}