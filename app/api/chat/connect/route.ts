import { NextRequest } from "next/server";

import { ConnectRequest } from "@/lib/api/types";
import { connectUseCase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

export async function POST(
  request: NextRequest,
) {
    const body: ConnectRequest =
      await request.json();

    const {
      threadId,
      clientId,
      conversationKey,
    } = body;

    return apiHandler(
      async () => {
        const role = await authorizeThreadAccess(threadId, conversationKey);
        return connectUseCase.execute(
        threadId,
        clientId,
        role,
        new Date(),
        new Date()
        );
      }
    );

}
