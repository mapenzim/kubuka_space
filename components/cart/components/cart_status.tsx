"use client";

import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function CartStatus({ isScrolled }: { isScrolled: boolean }) {
  const { cartCount, cartId } = useCart();

  return (
    <div>
      {cartCount > 0
        ? 
          <Link href={`/store/cart/${cartId}`} className="relative">
            <div className="relative cursor-pointer" aria-label="Shopping cart">
              <svg
                width="18"
                height="18"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${isScrolled ? "text-gray-700" : "text-white"}`}
              >
                <path
                  d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </Link>
        : 
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${isScrolled ? "text-gray-700" : "text-white"}`}
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
      }
    </div>
  );
}
