import { getBroadcaster } from "@/lib/broadcaster";
import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { getActiveActor, requirePermission } from "@/lib/rbac/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const actor = await getActiveActor();
  if (!actor) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: hasPermission(actor.role, PERMISSIONS.NOTIFICATIONS_MANAGE)
      ? undefined
      : { OR: [{ userId: actor.id }, { userId: null }] },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.NOTIFICATIONS_MANAGE);
    const body = await req.json();
  const { title, body: content, userId } = body;
  const note = await prisma.notification.create({
    data: {
      id: ulidId(),
      title,
      body: content,
      userId: userId ?? null,
    },
  });

  // publish to an in-memory broadcaster (see next file)
  try {
    const broadcaster = getBroadcaster();
    if (broadcaster) broadcaster.publish({
      type: "notification", payload: note,
      channel: ""
    });
  } catch {}

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
}
