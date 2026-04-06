import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { ulidId } from "@/lib/server-utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { title, content, authorId } = await req.json();
  const post = await prisma.post.create({ data: { id: ulidId(), title, content, authorId } });

  // publish
  const broadcaster = getBroadcaster();
  broadcaster.publish({
    type: "post", payload: post,
    channel: ""
  });

  return new Response(JSON.stringify(post), { status: 201 });
}
