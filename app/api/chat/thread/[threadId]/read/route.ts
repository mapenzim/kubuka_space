import { apiHandler } from "@/lib/api/api_handler";
import { markThreadReadUseCase } from "@/lib/container/runtime";

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
    markThreadReadUseCase.execute(threadId),
  );
}
