import { NextRequest } from "next/server";

import {
  HeartbeatRequest,
} from "@/lib/api/types";

import { heartbeatUseCase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";

export async function POST(
  request: NextRequest,
) {
  const body: HeartbeatRequest =
    await request.json();

  const {
    threadId,
    clientId,
  } = body;

  return apiHandler(
    () => heartbeatUseCase.execute(
      threadId, clientId
    )
  );
}
