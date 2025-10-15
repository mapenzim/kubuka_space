import { getBroadcaster } from "@/lib/broadcaster";
import prisma from "@/lib/prisma";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return new Response(JSON.stringify(notifications), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, body: content, userId } = body;
  const note = await prisma.notification.create({
    data: {
      title,
      body: content,
      userId: userId ? Number(userId) : null,
    },
  });

  // publish to an in-memory broadcaster (see next file)
  try {
    const broadcaster = getBroadcaster();
    if (broadcaster) broadcaster.publish({ type: "notification", payload: note });
  } catch (_) {}

  return new Response(JSON.stringify(note), { status: 201 });
}
