import { ThreadEventType } from "../events/thread/thread_event_type";
import { NotificationService } from "../notifications/notification_service";
import { Presence } from "./presence";
import { PresenceState } from "./presence_state";

export class PresenceService {
  constructor(
    private readonly state: PresenceState,
    private readonly notificationService: NotificationService,
  ) {}

  connect(presence: Presence): void {
    this.state.connect(presence);

    for (const participant of this.state.getAll(presence.threadId)) {
      this.notificationService.publishThread({
        type: ThreadEventType.PRESENCE_CHANGED,
        threadId: presence.threadId,
        timestamp: participant.lastSeen.toISOString(),
        payload: {
          clientId: participant.clientId,
          senderRole: participant.senderRole,
          online: true,
        },
      });
    }
  }

  disconnect(
    threadId: string,
    clientId: string,
  ): void {
    const presence = this.state.get(
      threadId,
      clientId,
    );

    if (!presence) {
      return;
    }

    this.state.disconnect(
      threadId,
      clientId,
    );

    this.notificationService.publishThread({
      type: ThreadEventType.PRESENCE_CHANGED,
      threadId,
      timestamp: new Date().toISOString(),
      payload: {
        clientId,
        senderRole: presence.senderRole,
        online: false,
      },
    });
  }

  getParticipants(
    threadId: string,
  ) {
    return this.state.getAll(threadId);
  }

  isOnline(
    threadId: string,
    clientId: string,
  ) {
    return this.state.isOnline(
      threadId,
      clientId,
    );
  }

  heartbeat(
    threadId: string,
    clientId: string,
  ) {
    this.state.touch(
      threadId,
      clientId,
    );
  }
}
