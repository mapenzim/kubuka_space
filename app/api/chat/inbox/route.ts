// app/api/chat/inbox/route.ts

import { NextRequest } from "next/server";

import { bootstrap } from "@/server";

import { registerSSE } from "@/server/sse/register";
import { removeSSE } from "@/server/sse/cleanup";

import { presenceService } from "@/server/presence";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

bootstrap();

export async function GET(
  request: NextRequest
) {
  const role =
    (new URL(request.url)
      .searchParams.get("role") ??
      "admin") as "admin";

  const channel =
    "__admin_inbox__";

  const clientId =
    crypto.randomUUID();

  const stream =
    new ReadableStream<string>({
      async start(controller) {

        //--------------------------------------------------
        // Register SSE
        //--------------------------------------------------

        registerSSE(
          channel,
          clientId,
          role,
          controller
        );

        //--------------------------------------------------
        // Presence
        //--------------------------------------------------

        await presenceService.connect(
          channel,
          clientId,
          role,
          true
        );

        //--------------------------------------------------
        // Handshake
        //--------------------------------------------------

        controller.enqueue(
          `data: ${JSON.stringify({
            type: "connected",

            payload: {
              channel,

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
                channel,
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
                channel,
                clientId
              );

              presenceService.disconnect(
                channel,
                clientId
              );
            }
          }, 25000);

        //--------------------------------------------------
        // Disconnect
        //--------------------------------------------------

        request.signal.addEventListener(
          "abort",
          async () => {
            clearInterval(
              heartbeat
            );

            removeSSE(
              channel,
              clientId
            );

            await presenceService.disconnect(
              channel,
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
          channel,
          clientId
        );

        await presenceService.disconnect(
          channel,
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