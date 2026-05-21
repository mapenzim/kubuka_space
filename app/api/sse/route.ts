import { NextRequest } from "next/server";

import { registerSSE } from "@/server/sse/register";
import { removeSSE } from "@/server/sse/cleanup";
import { Role } from "@/server/state/chatState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const threadId = searchParams.get("threadId");
  const role = searchParams.get("role") as Role ?? "user";

  if (!threadId) {
    return new Response("Missing threadId", {
      status: 400,
    });
  }

  const clientId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      registerSSE(
        threadId,
        clientId,
        controller,
        role
      );

      controller.enqueue(
        `data: ${JSON.stringify({
          type: "connected",
        })}\n\n`
      );

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`: ping\n\n`);
        } catch {}
      }, 25000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);

        removeSSE(threadId, clientId);

        try {
          controller.close();
        } catch {}
      });
    },

    cancel() {
      removeSSE(threadId, clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control":
        "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}