import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { ulidId } from "@/lib/server-utils";
import { requirePermission } from "@/lib/rbac/server";
import { PERMISSIONS } from "@/lib/rbac/policy";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const actor = await requirePermission(PERMISSIONS.BLOG_CREATE);
    const { title, content } = await req.json();
    if (!String(title ?? "").trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        id: ulidId(),
        title: String(title).trim(),
        content: String(content ?? "").trim(),
        authorId: actor.id,
      },
    });

  // publish
  const broadcaster = getBroadcaster();
  broadcaster.publish({
    type: "post", payload: post,
    channel: ""
  });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
}
