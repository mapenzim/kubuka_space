import { NextRequest } from "next/server";

import {
  HeartbeatRequest,
} from "@/lib/api/types";

import { heartbeatUseCase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

export async function POST(
  request: NextRequest,
) {
  const body: HeartbeatRequest =
    await request.json();

  const {
    threadId,
    clientId,
    conversationKey,
  } = body;

  return apiHandler(
    async () => {
      await authorizeThreadAccess(threadId, conversationKey);
      return heartbeatUseCase.execute(threadId, clientId);
    }
  );
}
