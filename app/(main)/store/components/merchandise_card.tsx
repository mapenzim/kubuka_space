"use client";

import { GemIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCartAction } from "@/app/actions/cartActions.server";
import { useSession } from "next-auth/react";

type Props = {
  item: {
    id: number;
    title: string;
    body: string;
    price: number;
  };
  onCartUpdate?: () => void; // callback to notify parent of cart change
};

export default function MerchandiseCard({ item, onCartUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const col = item.body?.split(",") || [];

  const handleAddToCart = async () => {
    if (!session) return toast.error("You must be logged in");

    setLoading(true);
    try {
      const res = await addToCartAction(item.id, session?.user?.id as string);
      if ("error" in res) return toast.error(res.error.message);
      toast.success(`${item.title} added to cart`);

      if (onCartUpdate) onCartUpdate(); // notify parent to refresh cart count
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[60vh] justify-between p-4 bg-slate-500 text-gray-100 rounded-lg">
      <div className="flex items-start justify-start gap-x-8">
        <GemIcon className="h-6 w-6" />
        <h3 className="text-xl font-semibold uppercase">{item.title}</h3>
      </div>
      <ul className="list-outside ml-4">
        {col.map((str, index) => (
          <li key={index} className="list-disc text-xs capitalize">
            {str.trim()}
          </li>
        ))}
      </ul>
      <p className="text-sm font-semibold">${item.price}.00</p>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
