export * from "./CommandTypes";

export * from "./SendUserMessage";
export * from "./SendAdminMessage";

export * from "./GetThread";
export * from "./GetThreads";

export * from "./MarkThreadRead";

export * from "./ArchiveThread";
export * from "./DeleteThread";

import { SendUserMessageCommand } from "./SendUserMessage";
import { SendAdminMessageCommand } from "./SendAdminMessage";
import { GetThreadCommand } from "./GetThread";
import { GetThreadsCommand } from "./GetThreads";
import { MarkThreadReadCommand } from "./MarkThreadRead";
import { ArchiveThreadCommand } from "./ArchiveThread";
import { DeleteThreadCommand } from "./DeleteThread";

export type ChatCommand =
  | SendUserMessageCommand
  | SendAdminMessageCommand
  | GetThreadCommand
  | GetThreadsCommand
  | MarkThreadReadCommand
  | ArchiveThreadCommand
  | DeleteThreadCommand;