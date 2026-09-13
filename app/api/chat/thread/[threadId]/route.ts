import { apiHandler } from "@/lib/api/api_handler";
import { getThreadUseCase } from "@/lib/container/runtime";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

interface RouteProps {
  params: Promise<{
    threadId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps,
) {
  const { threadId } =
    await params;

  return apiHandler(async () => {
    const conversationKey = new URL(request.url).searchParams.get("conversationKey") ?? undefined;
    const role = await authorizeThreadAccess(threadId, conversationKey);
    const thread = await getThreadUseCase.execute(threadId);

    if (role === "user" && thread?.archived) {
      return null;
    }

    return thread;
  });
}
