import { apiHandler } from "@/lib/api/api_handler";
import { archiveThreadUseCase } from "@/lib/container/runtime";

interface RouteProps {
  params: Promise<{
    threadId: string;
  }>;
}

export async function POST(
  _request: Request,
  { params }: RouteProps,
) {
  const { threadId } =
    await params;

  return apiHandler(() =>
    archiveThreadUseCase.execute(threadId),
  );
}
