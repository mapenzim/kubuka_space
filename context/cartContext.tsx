"use client";

import {
  addToCartAction,
  deleteCartItem,
  getCartCount,
  getUserCart,
  updateCartQuantity,
} from "@/app/actions/cartActions.server";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  merchandise: { title: string; price: number };
  quantity: number;
}

const CartContext = createContext<any>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: CartItem[];
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const isGuest = !session?.user;

  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [cartLoading, setLoading] = useState(false);
  const [cartCount, setCount] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const mergedRef = useRef(false); // ✅ prevent double merge

  // ---------------------------
  // 🧠 Load guest cart on mount
  // ---------------------------
  useEffect(() => {
    if (initialCart.length === 0) {
      const stored = localStorage.getItem("tempCart");
      if (stored) setCart(JSON.parse(stored));
    }
    setHydrated(true);
  }, [initialCart]);

  // ---------------------------
  // 💾 Persist guest cart
  // ---------------------------
  useEffect(() => {
    if (hydrated && isGuest) {
      localStorage.setItem("tempCart", JSON.stringify(cart));
    }
  }, [cart, hydrated, isGuest]);

  // ---------------------------
  // 🔄 Merge guest cart ON LOGIN (once)
  // ---------------------------
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (!session?.user || mergedRef.current) return;

      const stored = localStorage.getItem("tempCart");
      const guestItems: { id: string; quantity: number }[] = stored
        ? JSON.parse(stored)
        : [];
      
      console.log("Merging guest cart with items:", guestItems);

      if (guestItems.length === 0) return;

      try {
        await addToCartAction(session.user.id, guestItems);

        localStorage.removeItem("tempCart");
        mergedRef.current = true;

        toast.success("Cart synced");
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Failed to merge cart");
      }
    };

    mergeGuestCart();
  }, [session?.user, router]);

  // ---------------------------
  // ➕ Add item
  // ---------------------------
  const addItem = async (item: CartItem) => {
    setLoading(true);

    try {
      if (session?.user) {
        const res = await addToCartAction(
          session.user.id,
          [],
          item.id
        );

        if ("error" in res) {
          return toast.error(res.error.message);
        }

        toast.success(`${item?.merchandise?.title} added to cart`);
        router.refresh();
      } else {
        setCart((prev) => {
          const existing = prev.find((i) => i.id === item.id);

          if (existing) {
            return prev.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          }

          return [...prev, { ...item, quantity: 1 }];
        });

        toast.success(`${item?.merchandise?.title} added to cart`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // ❌ Remove item
  // ---------------------------
  const removeItem = async (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    // LocalStorage update

    const storedCart = localStorage.getItem("tempCart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        const updated = parsed.filter((item: any) => item.id !== id);
        localStorage.setItem("tempCart", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to parse localStorage cart", err);
      }
    }

    // Database deletion (skip if guest)
    if (isGuest) return;

    const res = await deleteCartItem(id);

    if (!res || "error" in res) {
      console.error(res?.error);
      toast.error("Failed to remove item");
    } else {
      toast.success("Item removed");
      router.refresh();
    }
  };

  // ---------------------------
  // 🔢 Update quantity
  // ---------------------------
  const updateQuantity = async (id: string, newQty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );

    if (isGuest) return;

    const res = await updateCartQuantity(id, newQty);

    if (!res || "error" in res) {
      console.error(res?.error);
      toast.error("Failed to update quantity");
    } else {
      router.refresh();
    }
  };

  // ---------------------------
  // 📊 Fetch cart meta
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        const [count, cartData] = await Promise.all([
          getCartCount(session.user.id),
          getUserCart(session.user.id),
        ]);

        setCount(count);
        setCartId(cartData?.id ?? null);
      } else {
        const stored = localStorage.getItem("tempCart");
        if (stored) {
          const items = JSON.parse(stored);
          const total = items.reduce(
            (sum: number, i: { quantity: number }) =>
              sum + i.quantity,
            0
          );
          setCount(total);
        }
      }
    };

    fetchData();
  }, [session]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        cartLoading,
        cartCount,
        cartId,
        isGuest,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);