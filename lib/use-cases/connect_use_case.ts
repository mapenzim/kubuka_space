import { PresenceService } from "@/lib/presence/presence_service";
import { SenderRole } from "@/lib/interfaces/sender_role";

export class ConnectUseCase {
  constructor(
    private readonly presenceService: PresenceService,
  ) {}

  execute(
    threadId: string,
    clientId: string,
    senderRole: SenderRole,
    connectedAt: Date,
    lastSeen: Date
  ): void {
    this.presenceService.connect({
      threadId,
      clientId,
      senderRole,
      connectedAt,
      lastSeen,
    });
  }
}