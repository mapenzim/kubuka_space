import { CommandType } from "./CommandTypes";

export interface MarkThreadReadCommand {
  type: CommandType.MarkThreadRead;

  threadId: string;
}