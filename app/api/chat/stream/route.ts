import { addClient, removeClient } from "@/app/actions/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || crypto.randomUUID();
  const role = (req.nextUrl.searchParams.get("role") as "user" | "admin") || "user";

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;

      addClient({
        id: crypto.randomUUID(),
        userId,
        role,
        controller,
      });
    },

    cancel() {
      removeClient(userId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}