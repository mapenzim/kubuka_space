"use server";

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { containsProfanity } from "@/lib/utils";

type CreateMessageResult =
  | { success: true }
  | { error: { message: string } };

export async function createPrivateMessage(
  form: FormData
): Promise<CreateMessageResult> {
  try {
    const names = String(form.get("names") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    // Honeypot
    if (form.get("company")) {
      return { error: { message: "Spam detected." } };
    }

    // CAPTCHA verify
    const captchaToken = form.get("captchaToken");

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY_MESSAGE_FORM!,
          response: String(captchaToken),
        }),
      }
    );

    const data = await verifyRes.json();

    if (!data.success) {
      return { error: { message: "Captcha failed." } };
    }

    // ✅ Validation
    if (!names || !email || !message) {
      return { error: { message: "All fields are required." } };
    }

    if (message.length < 10) {
      return { error: { message: "Message too short." } };
    }

    if (containsProfanity(message)) {
      return { error: { message: "Message contains profanity." } };
    }

    // ✅ Create message
    await prisma.privatemessage.create({
      data: {
        id: ulidId(),
        names,
        email,
        message,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Create message error:", err);
    return { error: { message: "Failed to send message." } };
  }
}

export async function getMessages() {
  return prisma.privatemessage.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markMessageAsRead(id: string) {
  await prisma.privatemessage.update({
    where: { id },
    data: { read: true },
  });
}

export async function deleteMessage(id: string) {
  await prisma.privatemessage.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}