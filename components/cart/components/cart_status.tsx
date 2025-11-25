"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { getCartCount, getUserCart } from "@/app/actions/cartActions.server";
import Link from "next/link";
import { CheckoutLink } from "./link_to_checkout";

export default function CartStatus() {
  const { data: session } = useSession();
  const [count, setCount] = useState<number | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);

  const fetchData = async () => {
    if (!session?.user?.id) return;

    try {
      const userId = Number(session.user.id);

      const cartCount = await getCartCount(userId);
      setCount(cartCount);

      const cart = await getUserCart(userId);   // ⬅️ fetch cart item
      setCartId(cart?.id ?? null);
    } catch (err: any) {
      toast.error(err.message || "Failed to load cart info");
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  if (!session) return null;

  return (
    <div className="text-sm font-semibold text-gray-700">
      {cartId ? (
        <CheckoutLink params={{ id: String(cartId) }}>
          Cart: {count ?? 0}
        </CheckoutLink>
      ) : (
        <span>Cart: {count ?? 0}</span>
      )}
    </div>
  );
}
