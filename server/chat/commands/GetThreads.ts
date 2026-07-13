import { CommandType } from "./CommandTypes";

export interface GetThreadsCommand {
  type: CommandType.GetThreads;
}