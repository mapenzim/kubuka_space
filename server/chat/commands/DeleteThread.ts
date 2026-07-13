import { CommandType } from "./CommandTypes";

export interface DeleteThreadCommand {
  type: CommandType.DeleteThread;

  threadId: string;
}