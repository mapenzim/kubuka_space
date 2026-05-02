"use server";

import { auth } from "@/auth";
import { containsProfanity } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { ulidId } from "@/lib/server-utils";

type PostResult =
  | { success: true }
  | { error: { message: string } };

export async function createPost(formData: FormData): Promise<PostResult> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get('authorId') as string;

  await prisma.post.create({
    data: { 
      id: ulidId(), 
      title, 
      content, 
      authorId: authorId 
    },
  });

  return { success: true };
}

export async function publishPost(formData: FormData): Promise<PostResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/authentication");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  const authorId = formData.get("authorId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    return { error: { message: "Message contains profanity." } };
  }

  /*if(authorId) {
    return { error: { message: "You do not have permission to update this post." } }
  }*/

  const post = await prisma.post.upsert({
    where: {
      id: postId || "",
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
      id: ulidId(),
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

  // 🔥 Broadcast the new post to all connected SSE clients
  const broadcaster = getBroadcaster();
  broadcaster.publish({
    type: "post:created",
    payload: post,
    channel: ""
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");

  return { success: true }
}

export async function saveDraft(formData: FormData): Promise<PostResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    return { error: { message: "Title is required" } };
  }

  if (containsProfanity(content)) {
    return { error: { message: "Content contains profanity" } };
  }

  const post = await prisma.post.upsert({
    where: {
      id: postId ?? "",
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
      id: ulidId(),
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
  
  return { success: true };
}

export async function getOwnPosts(authorId: string) {
  return await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPosts() {
  return await prisma.post.findMany({
    where: { published: Boolean(true) },
    include: { author: {
      select: {
        name: true,
        email: true,
        image: true,
        id: true
      }
    } },
    orderBy: { createdAt: "desc" }
  });
}

export async function getPost (postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: { author: {
      select: {
        name: true,
        email: true,
        id: true,
        image: true
      }
    } }
  });
}
