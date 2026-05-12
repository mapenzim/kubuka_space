import { handleAdminReply, handleUserMessage } from "@/app/actions/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { role, userId, text, targetUserId } = body;

  if (role === "admin") {
    handleAdminReply(targetUserId, text);
  } else {
    handleUserMessage(
      {
        id: userId,
        userId,
        role: "user",
        controller: null as any, // not used here
      },
      text
    );
  }

  return NextResponse.json({ ok: true });
}