import { NextRequest } from "next/server";


import { ActivityRequestDto } from "@/lib/dto/activity_request_dto";
import { SenderRole } from "@/lib/interfaces/sender_role";
import { activityUsecase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";
import { authorizeThreadAccess } from "@/lib/chat/server/chat_access";

export async function POST(
  request: NextRequest,
) {
    const body: ActivityRequestDto = await request.json();

    const {
      threadId,
      clientId,
      activity,
      conversationKey,
    } = body;

    return apiHandler(
      async () => {
        const senderRole: SenderRole = await authorizeThreadAccess(threadId, conversationKey);
        return activityUsecase.execute(
        threadId,
        clientId,
        senderRole,
        activity
        );
      }
    );
}
