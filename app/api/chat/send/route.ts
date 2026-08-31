import { apiHandler } from "@/lib/api/api_handler";
import {
  sendMessageUseCase,
} from "@/lib/container/runtime";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
) {
  const body = await request.json() as {
    threadId?: unknown;
    content?: unknown;
    conversationKey?: unknown;
  };

  if (
    typeof body.threadId !== "string" ||
    !body.threadId.trim() ||
    typeof body.content !== "string" ||
    !body.content.trim()
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "A thread and message are required.",
      },
      { status: 400 },
    );
  }

  return apiHandler(async () => {
    const senderRole = await authorizeThreadAccess(
      body.threadId as string,
      typeof body.conversationKey === "string"
        ? body.conversationKey
        : undefined,
    );
    return sendMessageUseCase.execute({
      threadId: body.threadId as string,
      senderRole,
      content: body.content as string,
    });
  });
}
