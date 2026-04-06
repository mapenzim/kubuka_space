"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function CartStatus() {
  const { cartCount, cartId } = useCart();

  return (
    <div>
      {cartCount > 0
        ? 
          <Link href={`/store/cart/${cartId}`} className="relative">
            <div className="relative">
              <ShoppingCartIcon className="w-6 h-6 text-gray-200" aria-hidden="true" />
              <div className="absolute -top-1 right-1 flex size-3 items-center justify-center rounded-full bg-transparent">
                <p className="text-xs text-red-500 font-bold">{cartCount}</p>
              </div>
            </div>
          </Link>
        : <ShoppingCartIcon className="w-6 h-6 text-gray-200" aria-hidden="true" />
      }
    </div>
  );
}
