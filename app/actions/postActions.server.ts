"use server";

import { auth } from "@/auth";
import { containsProfanity } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function publishPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function saveDraft(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}
