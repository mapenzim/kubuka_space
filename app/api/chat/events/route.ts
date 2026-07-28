import { threadHub } from "@/lib/container/runtime";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const threadId =
    request.nextUrl.searchParams.get("threadId");

  const clientId =
    request.nextUrl.searchParams.get("clientId");

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

  const stream =
    new ReadableStream<string>({
      start(controller) {
        console.log(
          "[SSE] stream started",
          clientId,
          threadId,
        );

        threadHub.add({
          id: clientId,
          threadId,
          stream: controller,
        });

        controller.enqueue(
          "event: connected\n" +
          'data: {"connected":true}\n\n',
        );

        request.signal.addEventListener(
          "abort",
          () => {
            threadHub.remove(clientId);
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