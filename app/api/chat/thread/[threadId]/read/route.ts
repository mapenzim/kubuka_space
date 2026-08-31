import { apiHandler } from "@/lib/api/api_handler";
import { markThreadReadUseCase } from "@/lib/container/runtime";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

interface RouteProps {
  params: Promise<{
    threadId: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: RouteProps,
) {
  const { threadId } =
    await params;

  return apiHandler(async () => {
    const conversationKey = new URL(request.url).searchParams.get("conversationKey") ?? undefined;
    await authorizeThreadAccess(threadId, conversationKey);
    return markThreadReadUseCase.execute(threadId);
  });
}
