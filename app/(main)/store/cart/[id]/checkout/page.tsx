import { DISCOUNT, VAT } from "@/lib/utils";
import { auth } from "@/auth";
import CheckoutForm from "@/components/cart/components/checkout_form";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function validateCartId(id: string): string {
  if (!id || typeof id !== "string") {
    notFound();
  }
  return id;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const cartId = validateCartId(id);
  const session = await auth();

  // 🔐 Require auth
  if (!session?.user) {
    redirect(`/authentication?callbackUrl=/store/cart/${cartId}/checkout`);
  }

  // ✅ Fetch cart correctly
  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userId: session.user.id,
    },
    include: {
      cartItems: {
        include: {
          merchandise: true,
        },
      },
    },
  });

  if (!cart) return notFound();

  // 🧮 Totals
  const subtotal = cart.cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.merchandise?.price) || 0;
    return sum + quantity * price;
  }, 0);

  const vat = subtotal * Number(VAT || 0);
  const discount = Number(DISCOUNT || 0);
  const total = Math.max(0, subtotal + vat - discount);

  const isEmpty = cart.cartItems.length === 0;

  if (isEmpty) {
    redirect("/store"); // no checkout for empty carts
  }

  return (
    <div className="min-h-screen bg-transparent px-6 py-16 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-600 p-8 rounded-2xl shadow-lg">

        {/* 🧾 Order Summary */}
        <div className="mb-8">
          <h2 className="text-lg text-zinc-200 font-semibold mb-4">Order Summary</h2>

          <div className="divide-y dark:divide-zinc-500 border rounded-xl bg-gray-50 dark:bg-gray-800">
            {cart.cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium dark:text-zinc-400">
                    <span className="">Item ref:</span> <span className="text-orange-400">{item.id.slice(-6).toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium capitalize dark:text-zinc-400">
                    {item.merchandise?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${Number(item.merchandise?.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="ml-16 py-4 space-y-1 text-sm">
              <div className="flex justify-between pr-4">
                <span className="dark:text-zinc-400 font-semibold">Subtotal</span>
                <span className="dark:text-zinc-400">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pr-4">
                <span className="dark:text-zinc-400 font-semibold">VAT</span>
                <span className="dark:text-zinc-400">${vat.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pr-4">
                <span className="dark:text-zinc-400 font-semibold">Discount</span>
                <span className="dark:text-zinc-400">- ${discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold text-base pt-2 border-t border-zinc-500">
                <span className="dark:text-zinc-400 font-semibold">Total</span>
                <span className="dark:text-zinc-400 pr-4 underline decoration-2 underline-offset-2">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 💳 Checkout */}
        <CheckoutForm cartId={cart.id} total={total} />

      </div>
    </div>
  );
}