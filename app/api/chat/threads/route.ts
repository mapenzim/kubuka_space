import { apiHandler } from "@/lib/api/api_handler";
import { getThreadsUseCase } from "@/lib/container/runtime";
import { requireChatAdmin } from "@/lib/chat/server/chat_access";

export async function GET() {
  return apiHandler(async () => {
    await requireChatAdmin();
    return getThreadsUseCase.execute();
  });
}
