import { NextRequest, NextResponse } from "next/server";

import { chatGateway } from "@/server/chat/ChatGateway";

export const runtime = "nodejs";

interface SendBody {
  threadId?: string;

  sender?: string;

  email?: string;

  role: "user" | "admin" | "bot";

  text: string;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as SendBody;

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    if (!body.text.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    //--------------------------------------------------
    // USER MESSAGE
    //--------------------------------------------------

    if (body.role === "user") {
      if (
        !body.sender ||
        !body.email
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Sender and email are required.",
          },
          {
            status: 400,
          }
        );
      }

      const thread =
        await chatGateway.sendUserMessage(
          body.sender,
          body.email,
          body.text
        );

      return NextResponse.json({
        success: true,

        thread,
      });
    }

    //--------------------------------------------------
    // ADMIN MESSAGE
    //--------------------------------------------------

    if (
      body.role === "admin"
    ) {
      if (!body.threadId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "ThreadId is required.",
          },
          {
            status: 400,
          }
        );
      }

      const message =
        await chatGateway.sendAdminMessage(
          body.threadId,
          body.text
        );

      return NextResponse.json({
        success: true,

        message,
      });
    }

    //--------------------------------------------------
    // BOT MESSAGE (optional)
    //--------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        message:
          "Unsupported sender.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "[CHAT_SEND]",
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