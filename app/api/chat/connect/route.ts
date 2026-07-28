import { NextRequest } from "next/server";

import { ConnectRequest } from "@/lib/api/types";
import { connectUseCase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";

export async function POST(
  request: NextRequest,
) {
    const body: ConnectRequest =
      await request.json();

    const {
      threadId,
      clientId,
      role,
    } = body;

    return apiHandler(
      async () => connectUseCase.execute(
        threadId,
        clientId,
        role,
        new Date(),
        new Date()
      )
    );

}
