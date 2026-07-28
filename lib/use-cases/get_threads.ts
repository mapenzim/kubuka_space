import { ThreadSummaryDto } from "../dto/thread_summary_dto";
import { ThreadSummaryDtoMapper } from "../mappers/thread_summary_dto_mapper";
import { InboxService } from "../services/inbox_service";

export class GetThreads {
  constructor(
    private readonly inboxService: InboxService,
  ) {}

  async execute(): Promise<ThreadSummaryDto[]> {

    const threads =
      await this.inboxService.getThreads();

    return ThreadSummaryDtoMapper.toDtos(threads);
  }
}