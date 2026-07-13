import { NextRequest, NextResponse } from "next/server";

import { chatGateway } from "@/server/chat/ChatGateway";

export const runtime = "nodejs";

interface PresenceBody {
  threadId: string;

  clientId: string;

  online: boolean;

  role?: string;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as PresenceBody;

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
    // Connected
    //--------------------------------------------------

    if (body.online) {
      await chatGateway.userConnected(
        body.threadId,
        body.clientId,
        "user",
        body.online
      );
    }

    //--------------------------------------------------
    // Disconnected
    //--------------------------------------------------

    else {
      await chatGateway.userDisconnected(
        body.threadId,
        body.clientId
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "[CHAT_PRESENCE]",
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