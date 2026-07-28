import { ApiResponse } from "@/lib/api/response";
import { DisconnectRequest } from "@/lib/api/types";
import { disconnectUseCase } from "@/lib/container/runtime";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as DisconnectRequest;

    disconnectUseCase.execute(
      body.threadId,
      body.clientId,
    );

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
    });

  } catch (error) {
    console.error("[CHAT_DISCONNECT]", error);

    return NextResponse.json({
      error: error
    });
  }
}
