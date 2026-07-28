import { apiHandler } from "@/lib/api/api_handler";
import { getThreadUseCase } from "@/lib/container/runtime";

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

  return apiHandler(() =>
    getThreadUseCase.execute(threadId),
  );
}