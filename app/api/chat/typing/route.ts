import { NextRequest, NextResponse } from "next/server";

import { chatGateway } from "@/server/chat/ChatGateway";

export const runtime = "nodejs";

interface TypingBody {
  threadId: string;

  clientId: string;

  typing: boolean;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as TypingBody;

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    if (
      !body.threadId ||
      !body.clientId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "threadId and clientId are required.",
        },
        {
          status: 400,
        }
      );
    }

    //--------------------------------------------------
    // Typing Started
    //--------------------------------------------------

    if (body.typing) {
      await chatGateway.typingStarted(
        body.threadId,
        body.clientId
      );
    }

    //--------------------------------------------------
    // Typing Stopped
    //--------------------------------------------------

    else {
      await chatGateway.typingStopped(
        body.threadId,
        body.clientId
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "[CHAT_TYPING]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}