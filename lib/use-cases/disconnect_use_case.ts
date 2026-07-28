import { PresenceService } from "@/lib/presence/presence_service";

export class DisconnectUseCase {
  constructor(
    private readonly presenceService: PresenceService,
  ) {}

  execute(
    threadId: string,
    clientId: string,
  ): void {
    this.presenceService.disconnect(
      threadId,
      clientId,
    );
  }
}