"use server";

import { Paynow } from "paynow";
import prisma from "@/lib/prisma";

const paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID!,
  process.env.PAYNOW_INTEGRATION_KEY!
);

paynow.resultUrl = process.env.PAYNOW_RESULT_URL!;
paynow.returnUrl = process.env.PAYNOW_RETURN_URL!;

export async function initiateEcoCashPayment(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) throw new Error("Order not found");

    // ✅ Prevent duplicate payment attempts
    const existing = order.payments.find(
      (p) => p.status === "PENDING"
    );

    if (existing?.pollUrl) {
      return { redirectUrl: existing.pollUrl };
    }

    const payment = paynow.createPayment(
      `Order ${order.id}`,
      "customer@email.com"
    );

    payment.add("Order Payment", Number(order.totalAmount));

    const response = await paynow.send(payment);

    if (!response.success) {
      throw new Error("Payment initiation failed");
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await tx.payment.create({
      data: {
        id: crypto.randomUUID(),
        orderId,
        amount: order.totalAmount,
        method: "ECOCASH",
        status: "PENDING",
        pollUrl: response.pollUrl,
        transactionRef: response.pollUrl,
        expiresAt,
      },
    });

    return { redirectUrl: response.redirectUrl };
  });
}

export async function verifyPayment(orderId: string) {
  const payment = await prisma.payment.findFirst({
    where: { orderId },
  });

  if (!payment?.transactionRef) return false;

  const response = await fetch(payment.transactionRef);
  const data = await response.text();

  if (data.includes("Paid")) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID", status: "paid" },
    });

    return true;
  }

  return false;
}

/**
 * Reconcile payments that are still pending but may have been completed outside of the normal flow (e.g. webhook failure, user closed tab). This can be run as a scheduled job every 5-10 minutes.
 */
export async function reconcilePayments() {
  const pending = await prisma.payment.findMany({
    where: {
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
  });

  for (const payment of pending) {
    if (!payment.pollUrl) continue;

    const res = await fetch(payment.pollUrl);
    const text = await res.text();

    if (text.includes("Paid")) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paidAt: new Date() },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "PAID", status: "paid" },
      });
    }
  }
}

/**
 * make payment queues to expire after a given time
 */
export async function expirePayments() {
  await prisma.payment.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });
}

/**
 * initiate a new payment attempt for an existing order, useful if the previous payment 
 * attempt expired or failed. In a real app, you might want to limit the number of retries 
 * to prevent abuse.
 * @param orderId 
 * @returns 
 */
export async function retryPayment(orderId: string) {
  // just call initiate again
  return initiateEcoCashPayment(orderId);
}

/**
 * Get the status of a payment for a given order. This can be used to show the user the 
 * current payment status on the frontend, or for internal monitoring.
 * @param orderId 
 * @returns 
 */
export async function getPaymentStatus(orderId: string) {
  const payment = await prisma.payment.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });

  return payment?.status ?? "UNKNOWN";
}