"use server";

import { getBroadcaster } from "@/lib/broadcaster";
import prisma from "@/lib/prisma";
import { containsProfanity } from "@/lib/utils";

type CreateMessageResult =
  | { success: true }
  | { error: { message: string } };

export async function createPrivateMessage(form: FormData): Promise<CreateMessageResult> {
  const names = form.get("names") as string;
  const email = form.get("email") as string;
  const message = form.get("message") as string;

  if (containsProfanity(message)) {
    return { error: { message: "Contains profaity" } };
  }

  const pvt_message = await prisma.privatemessage.create({
    data: {
      names: names.trim(),
      email: email,
      message: message.trim()
    }
  });

  // 🔥 Broadcast the new post to all connected SSE clients
  const broadcaster = getBroadcaster();
  broadcaster.publish({
    type: "privatemessage:sent",
    payload: "private message",
    channel: ""
  });

  return { success: true };
}
