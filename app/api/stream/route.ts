import { getBroadcaster } from "@/lib/broadcaster";

function encode(str: string) {
  return new TextEncoder().encode(str);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") || "public";

  const broadcaster = getBroadcaster();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      controller.enqueue(encode(`: connected to ${channel}\n\n`));

      const send = (msg: { channel: string; type: string; payload: any }) => {
        if (closed || msg.channel !== channel) return;
        controller.enqueue(
          encode(`event: ${msg.type}\ndata: ${JSON.stringify(msg.payload)}\n\n`)
        );
      };

      const unsubscribe = broadcaster.subscribe(send, channel);

      const keepAlive = setInterval(() => {
        if (!closed) {
          try {
            controller.enqueue(encode(`: ping\n\n`));
          } catch {
            // controller already closed, stop interval
            clearInterval(keepAlive);
          }
        }
      }, 15000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // ignore if already closed
        }
      };

      (controller as any).oncancel = cleanup;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
/*
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") || "public"; // default channel

  const broadcaster = getBroadcaster();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      controller.enqueue(encode(`: connected to ${channel}\n\n`));

      const send = (msg: { channel: string; type: string; payload: any }) => {
        if (closed || msg.channel !== channel) return;
        controller.enqueue(
          encode(`event: ${msg.type}\ndata: ${JSON.stringify(msg.payload)}\n\n`)
        );
      };

      const unsubscribe = broadcaster.subscribe(send, channel);

      const keepAlive = setInterval(() => {
        if (!closed) controller.enqueue(encode(`: ping\n\n`));
      }, 15000);

      const cleanup = () => {
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
        controller.close();
      };

      (controller as any).oncancel = cleanup;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
*/