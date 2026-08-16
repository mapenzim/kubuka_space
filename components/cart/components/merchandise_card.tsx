"use client";

import { GemIcon } from "lucide-react";
import Loading from "@/components/loading";
import { useCart } from "@/context/cartContext";
import {
  getDiscountedUnitPrice,
  getProductDiscount,
} from "@/lib/pricing";

type Props = {
  item: {
    id: string;
    title: string;
    body: string;
    price: number;
    stockQuantity: number;
  };
};

export default function MerchandiseCard({ item }: Props) {
  const { cartLoading, addItem } = useCart(); 

  const col = item.body?.split(",") || [];
  const discount = getProductDiscount(item.price);
  const discountedPrice = getDiscountedUnitPrice(item.price);

  return (
    <div className="flex flex-col min-h-[30vh] justify-between p-4 bg-slate-500 text-gray-100 dark:bg-zinc-700 dark:text-gray-300 rounded-lg">
      <div className="flex items-start justify-start gap-x-8">
        <GemIcon className="h-6 w-6" />
        <h3 className="text-xl font-semibold uppercase">{item.title}</h3>
      </div>
      <ul className="list-outside ml-4 my-4">
        {col.map((str, index) => (
          <li key={index} className="list-disc text-xs capitalize">
            {str}
          </li>
        ))}
      </ul>
      {discount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-300 line-through">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-base font-semibold text-white">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            Save ${discount.toFixed(2)}
          </span>
        </div>
      ) : (
        <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
      )}
      <p className="text-xs">{item.stockQuantity > 0 ? `${item.stockQuantity} available` : "Out of stock"}</p>
        <button
          disabled={cartLoading || item.stockQuantity < 1}
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
          onClick={() => addItem(item)}
        >
          {cartLoading ? <Loading /> : item.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
    </div>
  );
}
