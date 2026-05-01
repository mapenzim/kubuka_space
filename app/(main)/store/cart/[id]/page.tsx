import { auth } from "@/auth";
import { CartButtons, CheckoutBtn } from "@/components/buttons/cart-btns";
import prisma from "@/lib/prisma";
import { DISCOUNT, VAT } from "@/lib/utils";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { notFound, } from "next/navigation";

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

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const cartId = validateCartId(id);

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          merchandise: true,
        },
      },
    },
  });

  console.log(`The id is the cart: ${cart}`);

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

  return (
    <section className="flex flex-col w-full items-start px-6 md:px-16 lg:px-16 xl:px-32 py-12">
      <header className="text-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-400 sm:text-3xl">
          Your Cart
        </h1>
      </header>
      <div className="w-full mt-8 space-y-3">
        {!isEmpty
          ? (
            <ul className="w-full max-w-5x">
              {cart.cartItems.map((item) => (
                <li 
                  key={item.id} 
                  className="flex flex-row w-fulll items-center justify-between odd:bg-gray-700 last:border-b border-zinc-600 px-2 py-1 gap-16"
                >
                  <CartButtons item={item} />
                  <div className="flex flex-1 items-center justify-between">
                  <h3 className="text-sm text-gray-900 dark:text-gray-400 capitalize">
                    {item.merchandise.title} Website Builder
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ${item.merchandise.price.toFixed(2)}
                  </p>

                  </div>
                </li>
              ))}
            </ul>
          )
          : (
            <div>
              <p className="text-gray-700 dark:text-zinc-400">
                Empty cart, let's go <Link href='/store' className="inline-block gap-2 hover:text-indigo-900">shopping. <LinkIcon className="w-4 inline" /> </Link>
              </p>
            </div>
          )
        }
        
        {/* Totals */}
        {!isEmpty && (
          <div className="mt-8 flex justify-end pt-2">
            <div className="w-full max-w-lg space-y-4">
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
                  <dd>- ${DISCOUNT.toFixed(2)}</dd>
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
};

export default Page;
