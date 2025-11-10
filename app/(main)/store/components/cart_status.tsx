"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Import server action (Next.js automatically treats async functions as server-only)
import { getCartCount } from "@/app/actions/cartActions.server";

export default function CartStatus() {
  const { data: session } = useSession();
  const [count, setCount] = useState<number | null>(null);

  const fetchCartCount = async () => {
    if (!session?.user?.id) return;

    try {
      const cartCount = await getCartCount(Number(session.user.id));
      setCount(cartCount);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch cart count");
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [session]);

  if (!session) return null;

  return (
    <div className="text-sm font-semibold text-gray-700">
      Cart: {count ?? 0}
    </div>
  );
}
