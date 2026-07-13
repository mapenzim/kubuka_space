import { CommandType } from "./CommandTypes";

export interface SendUserMessageCommand {
  type: CommandType.SendUserMessage;

  sender: string;

  email: string;

  content: string;
}