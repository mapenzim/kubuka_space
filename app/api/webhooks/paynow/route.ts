import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const status = String(body.get("status"));
  const pollUrl = String(body.get("pollurl"));

  if (!pollUrl) {
    return NextResponse.json({ error: "Missing pollUrl" }, { status: 400 });
  }

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { pollUrl },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // ✅ Idempotency check
    if (payment.status === "PAID") {
      return NextResponse.json({ ok: true });
    }

    if (status === "Paid") {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          rawWebhook: JSON.parse(JSON.stringify(Object.fromEntries(body))),
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          status: "paid",
        },
      });
    } else {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          rawWebhook: JSON.parse(JSON.stringify(Object.fromEntries(body))),
        },
      });
    }

    return NextResponse.json({ ok: true });
  });
}