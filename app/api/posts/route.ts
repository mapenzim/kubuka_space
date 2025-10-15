import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";

export async function POST(req: Request) {
  const { title, content, authorId } = await req.json();
  const post = await prisma.post.create({ data: { title, content, authorId: Number(authorId) } });

  // publish
  const broadcaster = getBroadcaster();
  broadcaster.publish({ type: "post", payload: post });

  return new Response(JSON.stringify(post), { status: 201 });
}
