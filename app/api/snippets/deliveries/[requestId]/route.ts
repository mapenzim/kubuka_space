import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getActiveActor } from "@/lib/rbac/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const actor = await getActiveActor();
  if (!actor) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { requestId } = await params;
  const request = await prisma.snippetRequest.findUnique({
    where: { id: requestId },
    select: {
      userId: true,
      language: true,
      category: true,
      delivery: {
        select: {
          title: true,
          description: true,
          files: true,
          dependencies: true,
          usageInstructions: true,
          version: true,
          deliveredAt: true,
        },
      },
    },
  });

  if (!request || !request.delivery) {
    return NextResponse.json({ error: "Snippet delivery not found." }, { status: 404 });
  }
  if (request.userId !== actor.id && !hasPermission(actor.role, PERMISSIONS.SNIPPETS_MANAGE)) {
    return NextResponse.json({ error: "You cannot access this delivery." }, { status: 403 });
  }

  return NextResponse.json({
    requestId,
    language: request.language,
    category: request.category,
    ...request.delivery,
    deliveredAt: request.delivery.deliveredAt?.toISOString() ?? null,
  });
}
