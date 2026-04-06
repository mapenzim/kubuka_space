"use client";

import { GemIcon } from "lucide-react";
import Loading from "@/components/loading";
import { useCart } from "@/context/cartContext";

type Props = {
  item: {
    id: string;
    title: string;
    body: string;
    price: number;
  };
};

export default function MerchandiseCard({ item }: Props) {
  const { cartLoading, addItem } = useCart(); // to trigger re-render on cart updates

  const col = item.body?.split(",") || [];

  return (
    <div className="flex flex-col min-h-[60vh] justify-between p-4 bg-slate-500 text-gray-100 rounded-lg">
      <div className="flex items-start justify-start gap-x-8">
        <GemIcon className="h-6 w-6" />
        <h3 className="text-xl font-semibold uppercase">{item.title}</h3>
      </div>
      <ul className="list-outside ml-4">
        {col.map((str, index) => (
          <li key={index} className="list-disc text-xs capitalize">
            {str}
          </li>
        ))}
      </ul>
      <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
        <button
          disabled={cartLoading}
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center justify-center gap-2"
          onClick={() => addItem(item)}
        >
          {cartLoading ? <Loading /> : "Add to Cart"}
        </button>
    </div>
  );
}