import { ThreadDto } from "../dto";
import { ThreadDetailsDtoMapper } from "../mappers/thread_details_dto_mapper";
import { InboxService } from "../services/inbox_service";

export class GetThread {
  constructor(
    private readonly inboxService: InboxService,
  ) {}

  async execute(
    threadId: string,
  ): Promise<ThreadDto | null> {

    const thread =
      await this.inboxService.getThread(threadId);

    if (!thread) {
      return null;
    }

    return ThreadDetailsDtoMapper.toDto(thread);
  }
}