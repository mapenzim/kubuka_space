import { ThreadEventType } from "../events/thread/thread_event_type";
import { NotificationService } from "../notifications/notification_service";
import { Activity } from "./activity";
import { ActivityState } from "./activity_state";

export class ActivityService {
  constructor(
    private readonly state: ActivityState,
    private readonly notificationService: NotificationService,
  ) {}
 
  setActivity(
    activity: Activity,
  ): void {
    if (activity.activity === "idle") {
      this.clearActivity(activity.threadId, activity.clientId);
      return;
    }

    this.state.set(activity);

    this.notificationService.publishThread({
      type: ThreadEventType.ACTIVITY_CHANGED,
      threadId: activity.threadId,
      timestamp: new Date().toISOString(),
      payload: {
        clientId: activity.clientId,
        senderRole: activity.senderRole,
        activity: activity.activity,
      },
    });
  }

  clearActivity(
    threadId: string,
    clientId: string,
  ): void {
    const activity = this.state.get(
      threadId,
      clientId,
    );

    if (!activity) {
      return;
    }

    this.state.clear(
      threadId,
      clientId,
    );

    this.notificationService.publishThread({
      type: ThreadEventType.ACTIVITY_CHANGED,
      threadId,
      timestamp: new Date().toISOString(),
      payload: {
        clientId,
        senderRole: activity.senderRole,
        activity: "idle",
      },
    });
  }

  startTyping(
    clientId: string,
    threadId: string,
    senderRole: Activity["senderRole"],
  ): void {
    this.setActivity({
      clientId,
      threadId,
      senderRole,
      activity: "typing",
      updatedAt: new Date(),
    });
  }

  stopTyping(
    threadId: string,
    clientId: string,
  ): void {
    this.clearActivity(
      threadId,
      clientId,
    );
  }

  getActivity(
    threadId: string,
    clientId: string,
  ): Activity | undefined {
    return this.state.get(
      threadId,
      clientId,
    );
  }

  getActivities(
    threadId: string,
  ): Activity[] {
    return this.state.getAll(threadId);
  }
}
