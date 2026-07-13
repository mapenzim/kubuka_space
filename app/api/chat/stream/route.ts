import { NextRequest } from "next/server";

import { registerSSE } from "@/server/sse/register";
import { removeSSE } from "@/server/sse/cleanup";

import { presenceService } from "@/server/presence";

import type { Role } from "@/server/state/chatState";
import { bootstrap } from "@/server/bootstrap";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

// Wire subscribers once
bootstrap();

export async function GET(
  request: NextRequest
) {
  const { searchParams } =
    new URL(request.url);

  const threadId =
    searchParams.get("threadId");

  const role =
    (searchParams.get("role") ??
      "user") as Role;

  if (!threadId) {
    return new Response(
      "Missing threadId",
      {
        status: 400,
      }
    );
  }

  const clientId =
    crypto.randomUUID();

  const stream =
    new ReadableStream<string>({
      async start(controller) {

        //--------------------------------------------------
        // Register SSE Connection
        //--------------------------------------------------

        registerSSE(
          threadId,
          clientId,
          role,
          controller
        );

        //--------------------------------------------------
        // Register Presence
        //--------------------------------------------------

        await presenceService.connect(
          threadId,
          clientId,
          role,
          true
        );

        //--------------------------------------------------
        // Initial Handshake
        //--------------------------------------------------

        controller.enqueue(
          `data: ${JSON.stringify({
            type: "connected",

            payload: {
              threadId,

              clientId,

              role,
            },
          })}\n\n`
        );

        //--------------------------------------------------
        // Heartbeat
        //--------------------------------------------------

        const heartbeat =
          setInterval(() => {
            try {
              presenceService.heartbeat(
                threadId,
                clientId
              );

              controller.enqueue(
                `: heartbeat\n\n`
              );
            } catch {
              clearInterval(
                heartbeat
              );

              removeSSE(
                threadId,
                clientId
              );

              presenceService.disconnect(
                threadId,
                clientId
              );
            }
          }, 25000);

        //--------------------------------------------------
        // Browser Closed
        //--------------------------------------------------

        request.signal.addEventListener(
          "abort",
          async () => {
            clearInterval(
              heartbeat
            );

            removeSSE(
              threadId,
              clientId
            );

            await presenceService.disconnect(
              threadId,
              clientId
            );

            try {
              controller.close();
            } catch {}
          }
        );
      },

      async cancel() {
        removeSSE(
          threadId,
          clientId
        );

        await presenceService.disconnect(
          threadId,
          clientId
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