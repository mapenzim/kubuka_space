import { ThreadDetailsDto } from "../dto/thread_details_dto";
import { ThreadDetailsDtoMapper } from "../mappers/thread_details_dto_mapper";
import { InboxService } from "../services/inbox_service";

export class GetThreadsByEmail {
  constructor(
    private readonly inboxService: InboxService,
  ) {}

  async execute(email: string, limit?: number): Promise<ThreadDetailsDto[]> {
    const threads = await this.inboxService.getThreadsByEmail(email, limit);
    return ThreadDetailsDtoMapper.toDtos(threads);
  }
}
