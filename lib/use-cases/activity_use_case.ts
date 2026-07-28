import { ActivityService } from "@/lib/activity/activity_service";
import { ActivityType } from "@/lib/activity/activity";
import { SenderRole } from "@/lib/interfaces/sender_role";

export class ActivityUseCase {
  constructor(
    private readonly activityService: ActivityService,
  ) {}

  execute(
    threadId: string,
    clientId: string,
    senderRole: SenderRole,
    activity: ActivityType,
  ): void {
    switch (activity) {
      case "typing":
        this.activityService.startTyping(
          clientId,
          threadId,
          senderRole,
        );
        break;

      case "idle":
        this.activityService.stopTyping(
          threadId,
          clientId,
        );
        break;
    }
  }
}