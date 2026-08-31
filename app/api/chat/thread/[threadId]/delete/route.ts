import { apiHandler } from "@/lib/api/api_handler";
import { chatGateway } from "@/lib/container/runtime";
import { requireChatAdmin } from "@/lib/chat/server/chat_access";

interface RouteProps {
  params: Promise<{
    threadId: string;
  }>;
}

export async function DELETE(
  _request: Request,
  { params }: RouteProps,
) {
  const { threadId } =
    await params;

  return apiHandler(async () => {
    await requireChatAdmin();
    return chatGateway.deleteThread(threadId);
  });
}
