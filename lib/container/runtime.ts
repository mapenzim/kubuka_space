import { ActivityService } from "../activity/activity_service";
import { ActivityState } from "../activity/activity_state";
import { ThreadHub } from "../chat/realtime/thread_hub";
import { ChatGateway } from "../gateway/chat_gateway";

import { NotificationService } from "../notifications/notification_service";

import { PresenceService } from "../presence/presence_service";
import { PresenceState } from "../presence/presence_state";
import { ConversationKeyService } from "../services/conversation_key_service";
import { ConversationHub } from "../sse/conversation_hub";

import { ActivityUseCase } from "../use-cases/activity_use_case";
import { ArchiveThread } from "../use-cases/archive_thread";
import { ConnectUseCase } from "../use-cases/connect_use_case";
import { DeleteThread } from "../use-cases/delete_thread";
import { DisconnectUseCase } from "../use-cases/disconnect_use_case";

import { GetThread } from "../use-cases/get_thread";
import { GetThreadSummary } from "../use-cases/get_thread_summary";
import { GetThreads } from "../use-cases/get_threads";
import { GetThreadsByEmail } from "../use-cases/get_threads_by_email";
import { HeartbeatUseCase } from "../use-cases/heartbeat_use_case";
import { MarkThreadRead } from "../use-cases/mark_thread_read";
import { SendMessage } from "../use-cases/send_message";
import { StartConversation } from "../use-cases/start_conversation";

import {
  chatService,
  inboxService,
} from "./service";

/*/
 Infrastructure
/*/
export const notificationService =
  new NotificationService();

export const presenceState =
  new PresenceState();

export const presenceService =
  new PresenceService(
    presenceState,
    notificationService,
  );

const activityState =
  new ActivityState();

export const activityService =
  new ActivityService(
    activityState,
    notificationService,
  );

export const threadHub = new ThreadHub(notificationService);

//
// Use Cases
//
export const getThreadUseCase =
  new GetThread(inboxService);

export const getThreadsUseCase =
  new GetThreads(inboxService);

export const getThreadsByEmailUseCase =
  new GetThreadsByEmail(inboxService);

export const conversationHub =
  new ConversationHub(
    notificationService,
  );

export const activityUsecase = new ActivityUseCase(activityService);

export const heartbeatUseCase = new HeartbeatUseCase(presenceService);

export const connectUseCase = new ConnectUseCase(presenceService);

export const disconnectUseCase = new DisconnectUseCase(presenceService);

export const conversationKeyService = new ConversationKeyService();

export const startConversationUseCase =
  new StartConversation(chatService, conversationKeyService);

export const markThreadReadUseCase =
  new MarkThreadRead(chatService);

export const archiveThreadUseCase =
  new ArchiveThread(chatService);

export const deleteThreadUseCase =
  new DeleteThread(chatService);

export const getThreadSummaryUseCase =
  new GetThreadSummary(
    inboxService,
  );

export const sendMessageUseCase =
  new SendMessage(
    chatService,
    getThreadSummaryUseCase,
    notificationService
  );

export const chatGateway =
  new ChatGateway(
    getThreadUseCase,
    getThreadSummaryUseCase,
    getThreadsUseCase,
    getThreadsByEmailUseCase,
    sendMessageUseCase,
    startConversationUseCase,
    markThreadReadUseCase,
    archiveThreadUseCase,
    deleteThreadUseCase,
    activityUsecase,
    heartbeatUseCase,
    connectUseCase,
    disconnectUseCase,

    notificationService,
    presenceService,
  );
