import { ChatService } from "../services/chat_service";
import { InboxService } from "../services/inbox_service";
import { MessageService } from "../services/message_service";
import { ThreadService } from "../services/thread_service";

import {
  messageRepository,
  threadRepository,
} from "./repositories";

export const inboxService =
  new InboxService(threadRepository);

export const messageService =
  new MessageService(messageRepository);

export const threadService =
  new ThreadService(threadRepository);

export const chatService =
  new ChatService(
    inboxService,
    threadService,
    messageService,
  ); 