import { apiHandler } from "@/lib/api/api_handler";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/roles";
import {
  chatGateway,
  sendMessageUseCase,
} from "@/lib/container/runtime";
import type { SenderRole } from "@/lib/interfaces/sender_role";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
) {
  const body = await request.json() as {
    threadId?: unknown;
    content?: unknown;
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

  const session = await auth();
  const senderRole: SenderRole = isAdminRole(session?.user?.role)
    ? "admin"
    : "user";

  // Authenticated users may only reply to their own support thread. Guests
  // remain supported for existing public conversations.
  if (senderRole === "user" && session?.user?.email) {
    const thread = await chatGateway.getThread(body.threadId);
    if (
      !thread ||
      thread.email.toLowerCase() !== session.user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot reply to this conversation.",
        },
        { status: 403 },
      );
    }
  }

  return apiHandler(() =>
    sendMessageUseCase.execute({
      threadId: body.threadId as string,
      senderRole,
      content: body.content as string,
    }),
  );
}
