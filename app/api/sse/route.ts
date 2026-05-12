import { NextRequest } from "next/server";
import { sseConnections } from "@/server/state/chatState";

export const runtime = "nodejs"; // IMPORTANT: SSE needs Node runtime
export const dynamic = "force-dynamic";

// -----------------------------------------
// SSE CONNECTION HANDLER
// -----------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");

  if (!threadId) {
    return new Response("Missing threadId", { status: 400 });
  }

  // -----------------------------------------
  // SET UP STREAM
  // -----------------------------------------
  const stream = new ReadableStream({
    start(controller) {
      // store controller so server actions can push events
      sseConnections.set(threadId, controller);

      // send initial handshake
      controller.enqueue(
        `data: ${JSON.stringify({
          type: "connected",
          threadId,
        })}\n\n`
      );

      // keep-alive ping (prevents Vercel proxy timeout)
      const keepAlive = setInterval(() => {
        controller.enqueue(`: ping\n\n`);
      }, 25000);

      // cleanup on abort
      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        sseConnections.delete(threadId);
        controller.close();
      });
    },

    cancel() {
      // fallback cleanup
      sseConnections.delete(threadId);
    },
  });

  // -----------------------------------------
  // RETURN SSE RESPONSE
  // -----------------------------------------
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}