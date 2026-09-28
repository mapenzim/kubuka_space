"use server";

import { containsProfanity } from "@/lib/utils";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { ulidId } from "@/lib/server-utils";
import { getActiveActor, requireActor, requirePermission } from "@/lib/rbac/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";

type PostResult =
  | { success: true }
  | { error: { message: string } };

export async function createPost(formData: FormData): Promise<PostResult> {
  const actor = await requirePermission(PERMISSIONS.BLOG_CREATE);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title) return { error: { message: "Title is required." } };
  if (containsProfanity(content)) {
    return { error: { message: "Content contains profanity." } };
  }

  await prisma.post.create({
    data: { 
      id: ulidId(), 
      title,
      content,
      authorId: actor.id,
    },
  });

  return { success: true };
}

export async function publishPost(formData: FormData): Promise<PostResult> {
  const actor = await requirePermission(PERMISSIONS.BLOG_CREATE);

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    return { error: { message: "Message contains profanity." } };
  }

  const existingPost = postId
    ? await prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          authorId: true,
          publishedAt: true,
        },
      })
    : null;

  if (postId && !existingPost) {
    return { error: { message: "Post not found." } };
  }

  if (existingPost && !hasPermission(actor.role, PERMISSIONS.BLOG_UPDATE_ANY)) {
    return {
      error: { message: "You do not have permission to update this post." },
    };
  }

  const publishedAt = existingPost?.publishedAt ?? new Date();
  const post = existingPost
    ? await prisma.post.update({
        where: { id: existingPost.id },
        data: {
          title: title.trim(),
          content: content?.trim(),
          published: true,
          publishedAt,
        },
      })
    : await prisma.post.create({
        data: {
          id: ulidId(),
          title: title.trim(),
          content: content?.trim(),
          published: true,
          publishedAt,
          authorId: actor.id,
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
  const actor = await requirePermission(PERMISSIONS.BLOG_CREATE);

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    return { error: { message: "Title is required" } };
  }

  if (containsProfanity(content)) {
    return { error: { message: "Content contains profanity" } };
  }

  const existingPost = postId
    ? await prisma.post.findUnique({ where: { id: postId } })
    : null;

  if (postId && !existingPost) {
    return { error: { message: "Post not found." } };
  }

  if (existingPost && !hasPermission(actor.role, PERMISSIONS.BLOG_UPDATE_ANY)) {
    return { error: { message: "You do not have permission to update this post." } };
  }

  const post = existingPost
    ? await prisma.post.update({
        where: { id: existingPost.id },
        data: {
          title: title.trim(),
          content: content?.trim(),
          published: false,
          publishedAt: null,
        },
      })
    : await prisma.post.create({
        data: {
          id: ulidId(),
          title: title.trim(),
          content: content?.trim(),
          published: false,
          authorId: actor.id,
        },
      });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  
  return { success: true };
}

export async function getOwnPosts(authorId: string) {
  const actor = await requireActor();
  if (actor.id !== authorId && !hasPermission(actor.role, PERMISSIONS.BLOG_READ_ANY)) {
    throw new Error("You can only view your own posts.");
  }
  return await prisma.post.findMany({
    where: { authorId, deletedAt: null },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPosts() {
  return await prisma.post.findMany({
    where: { published: true, deletedAt: null },
    include: { author: {
      select: {
        name: true,
        email: true,
        image: true,
        id: true
      }
    } },
    orderBy: { publishedAt: "desc" }
  });
}

export async function fetchAllPosts() {
  await requirePermission(PERMISSIONS.BLOG_READ_ANY);
  return await prisma.post.findMany({
    where: { deletedAt: null },
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
  const actor = await getActiveActor();
  const canReadUnpublished = actor && hasPermission(actor.role, PERMISSIONS.BLOG_READ_ANY);

  return await prisma.post.findFirst({
    where: canReadUnpublished
      ? { id: postId, deletedAt: null }
      : { id: postId, published: true, deletedAt: null },
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

export async function deletePost(postId: string, path: string) {
  try {
    await requirePermission(PERMISSIONS.BLOG_DELETE_ANY);
    await prisma.post.delete({ where: {id: postId} });
    revalidatePath(path);

    return { success: true };
  } catch {
    return { error: "Failed to delete post." }
  }
}

export async function archivePost(postId: string, path = "/admin/posts") {
  await requirePermission(PERMISSIONS.BLOG_ARCHIVE_ANY);
  await prisma.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  });
  revalidatePath(path);
  revalidatePath("/posts");
  return { success: true };
}
