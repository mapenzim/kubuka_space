import { NextRequest } from "next/server";

import { auth } from "@/auth";

import { ActivityRequestDto } from "@/lib/dto/activity_request_dto";
import { SenderRole } from "@/lib/interfaces/sender_role";
import { activityUsecase } from "@/lib/container/runtime";
import { apiHandler } from "@/lib/api/api_handler";
import { isAdminRole } from "@/lib/roles";

export async function POST(
  request: NextRequest,
) {
    const session = await auth();
    const body: ActivityRequestDto = await request.json();
    const senderRole: SenderRole = isAdminRole(session?.user?.role)
      ? "admin"
      : "user";

    const {
      threadId,
      clientId,
      activity,
    } = body;

    return apiHandler(
      async () => await activityUsecase.execute(
        threadId,
        clientId,
        senderRole,
        activity
      )
    );
}
