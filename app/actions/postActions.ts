"use server";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get('authorId') as string;

  const post = await prisma.post.create({
    data: { title, content, authorId: Number(authorId) },
  });

  // 🔥 Broadcast the new post to all connected SSE clients
  const broadcaster = getBroadcaster();
  broadcaster.publish({
    type: "post:created",
    payload: post,
    channel: ""
  });

  return post;
}
