import { apiHandler } from "@/lib/api/api_handler";
import { deleteThreadUseCase } from "@/lib/container/runtime";

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
    deleteThreadUseCase.execute(threadId),
  );
}