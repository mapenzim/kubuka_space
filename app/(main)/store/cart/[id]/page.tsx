import { CartButtons, CheckoutBtn } from "@/components/buttons/cart-btns";
import prisma, { serializeDecimal } from "@/lib/prisma";
import { DISCOUNT, VAT } from "@/lib/utils";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * ---------------------------
 * Types
 * ---------------------------
 */
interface Merchandise {
  title: string;
  price: number;
}

interface CartItem {
  id: string;
  quantity: number;
  merchandise: Merchandise;
}
type Params = { id: string };

type PageProps = {
  params: Promise<Params>;
};

/**
 * ---------------------------
 * Helpers
 * ---------------------------
 */
function validateCartId(id: string): string {
  console.log("Cart ID: ", id);
  if (!id) notFound();
  return id;
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

/**
 * ---------------------------
 * Page
 * ---------------------------
 */
export default async function Page({ params }: PageProps) {
  const cartId = validateCartId((await params)?.id);

  const cart = await prisma.cart.findFirst({
    where: { id: cartId },
    include: {
      cartItems: {
        include: { merchandise: true },
      },
    },
  });

  if (!cart) notFound();

  const safeCart = serializeDecimal(cart);

  const items: CartItem[] = safeCart.cartItems;

  const isEmpty = items.length === 0;

  /**
   * ---------------------------
   * Totals
   * ---------------------------
   */
  const subtotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity);
    const price = toNumber(item.merchandise?.price);
    return sum + qty * price;
  }, 0);

  const vat = subtotal * VAT;
  const discount = DISCOUNT;
  const total = Math.max(0, subtotal + vat - discount);

  return (
    <section className="flex flex-col w-full items-start px-6 md:px-16 lg:px-16 xl:px-32 py-12">
      
      {/* Header */}
      <header>
        <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-400 sm:text-3xl">
          Your Cart
        </h1>
      </header>

      {/* Body */}
      <div className="w-full mt-8 space-y-6">

        {/* ITEMS */}
        {!isEmpty ? (
          <ul className="w-full max-w-5xl space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-6 px-3 py-2 odd:bg-gray-100 dark:odd:bg-gray-700 border-b border-zinc-700"
              >
                <CartButtons item={item} />

                <div className="flex flex-1 items-center justify-between">
                  <h3 className="text-sm text-gray-900 dark:text-gray-300 capitalize">
                    {item.merchandise.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ${toNumber(item.merchandise.price).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-zinc-400">
            Empty cart — let’s go{" "}
            <Link href="/store" className="inline-flex items-center gap-1 hover:text-indigo-500">
              shopping <LinkIcon className="w-4 h-4" />
            </Link>
          </p>
        )}

        {/* TOTALS */}
        {!isEmpty && (
          <div className="flex justify-end pt-6">
            <div className="w-full max-w-lg space-y-3">

              <dl className="space-y-1 text-sm text-gray-700 dark:text-zinc-400">
                
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
                  <dd>- ${discount.toFixed(2)}</dd>
                </div>

                <div className="flex justify-between font-semibold">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>

              </dl>

              <CheckoutBtn isEmpty={isEmpty} cartId={cartId} />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}