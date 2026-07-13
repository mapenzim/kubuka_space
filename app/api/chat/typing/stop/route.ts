import { NextRequest } from "next/server";
import { typingService } from "@/server/typing/TypingService";

export async function POST(
  req: NextRequest
) {

  const body = await req.json();

  typingService.stop(
    body.threadId,
    body.clientId
  );

  return Response.json({
    success: true,
  });
}