import { apiHandler } from "@/lib/api/api_handler";
import { startConversationUseCase } from "@/lib/container/runtime";

export async function POST(
  request: Request,
) {
  const body =
    await request.json();

  return apiHandler(() =>
    startConversationUseCase.execute(body),
  );
}