import { apiHandler } from "@/lib/api/api_handler";
import { chatGateway } from "@/lib/container/runtime";

export async function POST(
  request: Request,
) {
  const body =
    await request.json();

  return apiHandler(() =>
    chatGateway.startConversation(
      body.sender,
      body.email,
      body.content,
      body.conversationKey,
    ),
  );
}
