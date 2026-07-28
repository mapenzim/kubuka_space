import { apiHandler } from "@/lib/api/api_handler";
import { sendMessageUseCase } from "@/lib/container/runtime";

export async function POST(
  request: Request,
) {
  const body =
    await request.json();

  console.log(body);

  return apiHandler(() =>
    sendMessageUseCase.execute(body),
  );
}