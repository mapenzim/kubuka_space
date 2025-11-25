import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckoutForm from "../../../components/checkout_form";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function CheckoutPage({ params }: Props) {
  const cartId = Number(params.id);

  if (!cartId || isNaN(cartId)) return notFound();

  // Fetch cart + items
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      merchandise: {
        include: {
          cartItems: {
            include: {
              merchandise: true
            }
          },
        },
      },
    },
  });

  if (!cart) return notFound();

  const total = cart.merchandise.cartItems.reduce(
    (sum, item) => sum + item.quantity * item.merchandise.price,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

        {/* Cart Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-3">Order Summary</h2>
          <div className="divide-y border rounded-xl bg-gray-50">
            {cart.merchandise.cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    Order  number: {item.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ${(item.merchandise.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 text-lg font-semibold">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <button 
            type="button"
            className="flex rounded-md px-2 py-1 bg-indigo-400 text-orange-600 items-center justify-end"
          >
            cancel order
          </button>
        </div>

        {/* Checkout Form */}
        <CheckoutForm cartId={cart.id} total={total} />

      </div>
    </div>
  );
}
