import { CommandType } from "./CommandTypes";

export interface GetThreadCommand {
  type: CommandType.GetThread;

  threadId: string;
}