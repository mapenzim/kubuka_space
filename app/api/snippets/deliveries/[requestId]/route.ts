import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id || session.user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: { select: { name: true } } },
  });
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
  if (request.userId !== session.user.id && !isAdminRole(actor?.role?.name)) {
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
