import { ActivityType } from "../activity/activity";
import { ActivityService } from "../activity/activity_service";
import { MessageDto } from "../dto";
import { ThreadDetailsDto } from "../dto/thread_details_dto";
import { ThreadSummaryDto } from "../dto/thread_summary_dto";
import { ConversationEventType } from "../events/conversation/conversation_event_type";
import { ThreadEventType } from "../events/thread/thread_event_type";
import { SenderRole } from "../interfaces/sender_role";
import { NotificationService } from "../notifications/notification_service";
import { PresenceService } from "../presence/presence_service";
import { ActivityUseCase } from "../use-cases/activity_use_case";
import { ArchiveThread } from "../use-cases/archive_thread";
import { ConnectUseCase } from "../use-cases/connect_use_case";
import { DeleteThread } from "../use-cases/delete_thread";
import { DisconnectUseCase } from "../use-cases/disconnect_use_case";

import { GetThread } from "../use-cases/get_thread";
import { GetThreadSummary } from "../use-cases/get_thread_summary";
import { GetThreads } from "../use-cases/get_threads";
import { HeartbeatUseCase } from "../use-cases/heartbeat_use_case";
import { MarkThreadRead } from "../use-cases/mark_thread_read";
import { SendMessage } from "../use-cases/send_message";
import { StartConversation } from "../use-cases/start_conversation";

export class ChatGateway {
  constructor(
    private readonly getThreadUseCase: GetThread,
    private readonly getThreadSummaryUseCase: GetThreadSummary,
    private readonly getThreadsUseCase: GetThreads,
    private readonly sendMessageUseCase: SendMessage,

    private readonly startConversationUseCase: StartConversation,
    private readonly markThreadReadUseCase: MarkThreadRead,
    private readonly archiveThreadUseCase: ArchiveThread,
    private readonly deleteThreadUseCase: DeleteThread,
    private readonly activityUseCase: ActivityUseCase,
    private readonly heartbeatUseCase: HeartbeatUseCase,
    private readonly connectUseCase: ConnectUseCase,
    private readonly disconnectUseCse: DisconnectUseCase,

    private readonly notificationService: NotificationService,
    private readonly presenceService: PresenceService,
    private readonly activityService: ActivityService,
    
  ) {}

  async getThread(
    threadId: string,
  ): Promise<ThreadDetailsDto | null> {
    return this.getThreadUseCase.execute(
      threadId,
    );
  }

  //async getThreadSummary() : Promise<> {}

  async getThreads(): Promise<ThreadSummaryDto[]> {
    return this.getThreadsUseCase.execute();
  }

  async markThreadRead(
    threadId: string,
  ): Promise<void> {
    await this.markThreadReadUseCase.execute(
      threadId,
    );
  }

  async archiveThread(
    threadId: string,
  ): Promise<void> {
    await this.archiveThreadUseCase.execute(
      threadId,
    );

    this.notificationService.publishConversation({
      type:
        ConversationEventType.CONVERSATION_ARCHIVED,
      timestamp: new Date().toISOString(),
      payload: {
        threadId,
      },
    });
  }

  async deleteThread(
    threadId: string,
  ): Promise<void> {
    await this.deleteThreadUseCase.execute(
      threadId,
    );

    this.notificationService.publishConversation({
      type:
        ConversationEventType.CONVERSATION_DELETED,
      timestamp: new Date().toISOString(),
      payload: {
        threadId,
      },
    });
  }

  async sendMessage(
    threadId: string,
    senderRole: SenderRole,
    content: string,
  ): Promise<MessageDto> {
    const message =
      await this.sendMessageUseCase.execute({
        threadId,
        senderRole,
        content,
      });

    this.notificationService.publishThread({
      type: ThreadEventType.MESSAGE_CREATED,
      threadId,
      timestamp: new Date().toISOString(),
      payload: {
        message,
      },
    });
    const summary =
      await this.getThreadSummaryUseCase.execute(
        threadId,
      );

    if (summary) {
      this.notificationService.publishConversation({
        type:
          ConversationEventType.CONVERSATION_UPDATED,
        timestamp: new Date().toISOString(),
        payload: {
          thread: summary,
        },
      });
    }

    return message;
  }

  async startConversation(
    sender: string,
    email: string,
    content: string,
    conversationKey?: string,
    senderRole: SenderRole = "user",
  ): Promise<ThreadDetailsDto> {
    const thread =
      await this.startConversationUseCase.execute({
        sender,
        email,
        content,
        conversationKey,
        senderRole,
      });

    const summary =
      await this.getThreadSummaryUseCase.execute(
        thread.id,
      );

    if (summary) {
      this.notificationService.publishConversation({
        type:
          thread.messages.length > 1
            ? ConversationEventType.CONVERSATION_UPDATED
            : ConversationEventType.CONVERSATION_CREATED,
        timestamp: new Date().toISOString(),
        payload: {
          thread: summary,
        },
      });
    }

    return thread;
  }

  async setHeartbeat(
    threadId: string,
    clientId: string
  ): Promise<void> {
    await this.heartbeatUseCase.execute(threadId, clientId)
  }

  async setActivity(
    threadId: string,
    clientId: string,
    senderRole: SenderRole,
    activity: ActivityType,
  ): Promise<void> {
    this.activityUseCase.execute(
      threadId,
      clientId,
      senderRole,
      activity,
    );
  }

  connect(
    clientId: string,
    threadId: string,
    senderRole: SenderRole,
    connectedAt: Date,
    lastSeen: Date
  ): void {
    this.connectUseCase.execute(
      clientId,
      threadId,
      senderRole,
      connectedAt,
      lastSeen,
    );
  }

  disconnect(
    threadId: string,
    clientId: string,
  ): void {
    this.disconnectUseCse.execute(
      threadId,
      clientId,
    );
  }

  getParticipants(
    threadId: string,
  ) {
    return this.presenceService.getParticipants(
      threadId,
    );
  }

  isOnline(
    threadId: string,
    clientId: string,
  ): boolean {
    return this.presenceService.isOnline(
      threadId,
      clientId,
    );
  }

}
