import { PresenceService } from "@/lib/presence/presence_service";

export class HeartbeatUseCase {
  constructor(
    private readonly presenceService: PresenceService,
  ) {}

  async execute(
    threadId: string,
    clientId: string,
  ): Promise<void> {
    await this.presenceService.heartbeat(
      threadId,
      clientId,
    );
  }
}