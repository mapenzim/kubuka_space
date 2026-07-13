import { CommandType } from "./CommandTypes";

export interface ArchiveThreadCommand {
  type: CommandType.ArchiveThread;

  threadId: string;
}