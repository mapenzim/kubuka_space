import { NextRequest } from "next/server";

import { conversationHub } from "@/lib/container/runtime";
import { ConversationClient } from "@/lib/sse/conversation_client";
import { requireChatAdmin } from "@/lib/chat/server/chat_access";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
) {
  try {
    await requireChatAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const clientId =
    request.nextUrl.searchParams.get(
      "clientId",
    );

  if (!clientId) {
    return new Response(
      "Missing clientId",
      {
        status: 400,
      },
    );
  }

  let heartbeat: any = null;
  let connectionId: string | undefined;
  const stream =
    new ReadableStream<string>({

      start(controller) {
        connectionId = crypto.randomUUID();
        const client: ConversationClient =
          {
            id: clientId,
            connectionId,
            stream: controller,
          };

        conversationHub.add(
          client,
        );
        controller.enqueue(
          `event: connected\n` +
          `data: {}\n\n`,
        );
        heartbeat = setInterval(() => {
          try {
            controller.enqueue(
              `: heartbeat\n\n`,
            );
          } catch {
            clearInterval(heartbeat);
          }
        }, 30000);
      },

      cancel() {
        clearInterval(heartbeat);

        if (connectionId) {
          conversationHub.remove(connectionId);
        }
      }
    });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream",

      "Cache-Control":
        "no-cache, no-transform",

      Connection: "keep-alive",
    },
  });
}
