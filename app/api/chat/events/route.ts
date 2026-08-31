import {
  presenceService,
  threadHub,
} from "@/lib/container/runtime";
import { ThreadEventType } from "@/lib/events/thread/thread_event_type";
import { NextRequest } from "next/server";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
) {
  const threadId =
    request.nextUrl.searchParams.get("threadId");

  const clientId =
    request.nextUrl.searchParams.get("clientId");

  const conversationKey =
    request.nextUrl.searchParams.get("conversationKey") ?? undefined;

  if (!threadId?.trim()) {
    return new Response(
      "Missing threadId.",
      { status: 402 },
    );

  }

  if (!clientId?.trim()) {
    return new Response(
      "Missing clientId.",
      { status: 401 },
    );
  }

  try {
    await authorizeThreadAccess(threadId, conversationKey);
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const stream =
    new ReadableStream<string>({
      start(controller) {
        const connectionId = crypto.randomUUID();
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(": heartbeat\n\n");
          } catch {
            clearInterval(heartbeat);
          }
        }, 25000);
        threadHub.add({
          id: clientId,
          connectionId,
          threadId,
          stream: controller,
        });

        controller.enqueue(
          "event: connected\n" +
          'data: {"connected":true}\n\n',
        );

        for (const participant of presenceService.getParticipants(threadId)) {
          controller.enqueue(
            `data: ${JSON.stringify({
              type: ThreadEventType.PRESENCE_CHANGED,
              threadId,
              timestamp: participant.lastSeen.toISOString(),
              payload: {
                clientId: participant.clientId,
                senderRole: participant.senderRole,
                online: true,
              },
            })}\n\n`,
          );
        }

        request.signal.addEventListener(
          "abort",
          () => {
            clearInterval(heartbeat);
            threadHub.remove(connectionId);
          },
        );
      },
    });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream",
      "Cache-Control":
        "no-cache, no-transform",
      Connection:
        "keep-alive",
      "X-Accel-Buffering":
        "no",
    },
  });
}
