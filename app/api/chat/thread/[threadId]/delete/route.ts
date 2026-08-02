import { apiHandler } from "@/lib/api/api_handler";
import { chatGateway } from "@/lib/container/runtime";

interface RouteProps {
  params: Promise<{
    threadId: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteProps,
) {
  const { threadId } =
    await params;

  return apiHandler(() =>
    chatGateway.deleteThread(threadId),
  );
}
