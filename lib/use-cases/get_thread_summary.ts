import { ThreadSummaryDto } from "../dto/thread_summary_dto";
import { ThreadSummaryDtoMapper } from "../mappers/thread_summary_dto_mapper";
import { InboxService } from "../services/inbox_service";

export class GetThreadSummary {
  constructor(
    private readonly inboxService: InboxService,
  ) {}

  async execute(
    threadId: string,
  ): Promise<ThreadSummaryDto | null> {
    const summary =
      await this.inboxService.getThreadSummary(
        threadId,
      );

    if (!summary) {
      return null;
    }

    return ThreadSummaryDtoMapper.toDto(
      summary,
    );
  }
}