import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CheckCircle2, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ReceiptPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatReceiptDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Harare",
  }).format(date);
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/authentication?callbackUrl=${encodeURIComponent(
        `/store/receipt/${orderId}`,
      )}`,
    );
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
      shippingAddress: true,
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!order) {
    notFound();
  }

  const payment = order.payments[0];
  const completedAt = payment?.paidAt ?? order.createdAt;
  const receiptNumber = order.id.slice(-10).toUpperCase();
  const isComplete =
    order.status === "paid" && order.paymentStatus === "PAID";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <header className="border-b border-zinc-200 bg-emerald-50 px-6 py-10 text-center dark:border-zinc-800 dark:bg-emerald-950/30 sm:px-10">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
              <CheckCircle2
                aria-hidden="true"
                className="h-9 w-9 text-emerald-600 dark:text-emerald-400"
              />
            </span>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              {isComplete ? "Transaction complete" : "Order received"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Thank you for your order
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Your order has been confirmed and a receipt is available below.
            </p>
          </header>

          <div className="space-y-8 px-6 py-8 sm:px-10">
            <div className="grid gap-5 rounded-xl bg-zinc-50 p-5 dark:bg-zinc-800/60 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Receipt
                </p>
                <p className="mt-1 font-mono text-sm font-semibold">
                  #{receiptNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Date
                </p>
                <time
                  dateTime={completedAt.toISOString()}
                  className="mt-1 block text-sm font-medium"
                >
                  {formatReceiptDate(completedAt)}
                </time>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </p>
                <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {isComplete ? "Completed" : "Received"}
                </span>
              </div>
            </div>

            <section aria-labelledby="receipt-items">
              <div className="mb-4 flex items-center gap-2">
                <ReceiptText
                  aria-hidden="true"
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                />
                <h2 id="receipt-items" className="text-lg font-semibold">
                  Order details
                </h2>
              </div>

              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {order.items.map((item) => {
                    const unitPrice = Number(item.price);
                    const lineTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-5 px-4 py-4 sm:px-5"
                      >
                        <div>
                          <p className="font-medium capitalize">{item.title}</p>
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {item.quantity} ×{" "}
                            {formatMoney(unitPrice, order.currency)}
                          </p>
                        </div>
                        <p className="shrink-0 font-semibold">
                          {formatMoney(lineTotal, order.currency)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-5 dark:border-zinc-700 dark:bg-zinc-800/60 sm:px-5">
                  <span className="text-base font-semibold">Total paid</span>
                  <span className="text-xl font-bold">
                    {formatMoney(Number(order.totalAmount), order.currency)}
                  </span>
                </div>
              </div>
            </section>

            <div className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:grid-cols-2">
              <section aria-labelledby="delivery-address">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin
                    aria-hidden="true"
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  />
                  <h2 id="delivery-address" className="font-semibold">
                    Delivery address
                  </h2>
                </div>
                {order.shippingAddress && (
                  <address className="not-italic text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                      {order.shippingAddress.fullName}
                    </span>
                    <span className="block">{order.shippingAddress.street}</span>
                    <span className="block">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </span>
                  </address>
                )}
              </section>

              <section aria-labelledby="payment-details">
                <h2 id="payment-details" className="mb-3 font-semibold">
                  Payment details
                </h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 dark:text-zinc-400">Method</dt>
                    <dd className="font-medium">Checkout confirmation</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                    <dd className="truncate font-medium">{order.user.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500 dark:text-zinc-400">Order ID</dt>
                    <dd className="font-mono text-xs">{order.id}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row">
              <Link
                href="/store"
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
              >
                Continue shopping
              </Link>
              <Link
                href="/profile"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-3 font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                View order history
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
