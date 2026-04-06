"use client";

import { DISCOUNT, VAT } from "@/lib/utils";
import RemoveAlert from "@/components/modals/alert";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  merchandise: {
    title: string;
    price: number;
  };
  quantity: number;
}

const CartPage = () => {
  const { cart, cartLoading, isGuest, removeItem, updateQuantity, cartId } = useCart();
  const router = useRouter();

  // Totals
  const subtotal = cart.reduce(
    (sum: number, item: { merchandise: { price: number; }; quantity: number; }) => sum + item.merchandise.price * item.quantity,
    0
  );

  const vat = subtotal * VAT;
  const total = Math.max(0, subtotal + vat - DISCOUNT);
  const isCartEmpty = cart.length === 0;

  const handleCheckout = async () => {
    if (isCartEmpty) return;

    if (isGuest) {
      return signIn(undefined, { callbackUrl: "/store/cart" });
    }

    if (!cartId) return;

    router.push(`/store/cart/${cartId}/checkout`);
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

          <div className="mt-8">
            {isCartEmpty ? (
              <p className="text-gray-500 text-center">
                No items found in this cart.
              </p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item: CartItem) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1160"
                      alt={item.merchandise.title}
                      className="size-16 rounded-sm object-cover"
                    />

                    <div>
                      <h3 className="text-sm text-gray-900 capitalize">
                        {item.merchandise.title}
                      </h3>

                      <p className="text-xs text-gray-600">
                        ${item.merchandise.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        disabled={cartLoading}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!value || value < 1) return;
                          updateQuantity(item.id, value);
                        }}
                        className="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 text-center text-xs"
                      />

                      <RemoveAlert
                        trigger={
                          <button className="text-gray-600 hover:text-red-600">
                            {cartLoading ? (
                              <Loader2Icon size={16} className="animate-spin" />
                            ) : (
                              "✕"
                            )}
                          </button>
                        }
                        title="Remove item from cart?"
                        description="This action cannot be undone."
                        confirmText="Remove"
                        cancelText="Cancel"
                        onConfirm={() => removeItem(item.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Totals */}
            {!isCartEmpty && (
              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="w-full max-w-lg space-y-4">
                  <dl className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>${subtotal.toFixed(2)}</dd>
                    </div>

                    <div className="flex justify-between">
                      <dt>VAT</dt>
                      <dd>${vat.toFixed(2)}</dd>
                    </div>

                    <div className="flex justify-between">
                      <dt>Discount</dt>
                      <dd>- ${DISCOUNT.toFixed(2)}</dd>
                    </div>

                    <div className="flex justify-between font-semibold">
                      <dt>Total</dt>
                      <dd>${total.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <button
                      className="rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600 disabled:bg-gray-300 disabled:text-gray-500"
                      disabled={isCartEmpty || !cartId}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;