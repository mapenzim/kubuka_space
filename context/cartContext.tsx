"use client";

import {
  addToCartAction,
  deleteCartItem,
  getCartMeta,
  updateCartQuantity,
} from "@/app/actions/cartActions.server";

import { safeParse } from "@/lib/safe-parse";
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

import {
  Cart,
  CartItem,
  emptyCart,
  InitialCartInput,
  MerchandiseItem,
} from "@/lib/interfaces";

/* ---------------------------
   🧱 CONSTANTS
---------------------------- */

type GuestCart = {
  merchandiseId: string;
  quantity: number;
}[];

/* ---------------------------
   CONTEXT
---------------------------- */

const CartContext = createContext<any>(null);


function normalizeCart(input?: InitialCartInput): Cart {
  return input ?? emptyCart;
}

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart?: InitialCartInput;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const isGuest = !session?.user;

  const [cart, setCart] = useState<Cart>(normalizeCart(initialCart));
  const [cartLoading, setLoading] = useState(false);
  const [cartCount, setCount] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const mergedRef = useRef(false);

  /* ---------------------------
     🧠 HYDRATE GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (initialCart) {
      setHydrated(true);
      return;
    }

    const stored = localStorage.getItem("tempCart");
    const items = safeParse<GuestCart>(stored);

    if (!items || items.length === 0) {
      localStorage.removeItem("tempCart");
      setCart(emptyCart);
      setHydrated(true);
      return;
    }

    const hydratedCart: Cart = {
      ...emptyCart,
      cartItems: items.map((item) => ({
        id: crypto.randomUUID(),
        merchandise: {
          id: item.merchandiseId,
          title: "",
          body: "",
          price: 0,
        },
        quantity: item.quantity,
      })),
    };

    setCart(hydratedCart);
    setHydrated(true);
  }, [initialCart]);

  /* ---------------------------
     💾 PERSIST GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (!hydrated || !isGuest) return;

    const minimal: GuestCart = cart?.cartItems?.map((item) => ({
      merchandiseId: item.merchandise.id,
      quantity: item.quantity,
    }));

    localStorage.setItem("tempCart", JSON.stringify(minimal));
  }, [cart, hydrated, isGuest]);

  /* ---------------------------
     🔄 MERGE CART ON LOGIN
  ---------------------------- */
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (!session?.user?.id || mergedRef.current) return;

      const stored = localStorage.getItem("tempCart");
      const guestItems = safeParse<GuestCart>(stored);

      if (!guestItems || guestItems.length === 0) return;

      try {
        for (const item of guestItems) {
          await addToCartAction({
            userId: session.user.id,
            merchandiseId: item.merchandiseId,
            quantity: item.quantity,
          });
        }

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
  }, [session?.user?.id]);

  /* ---------------------------
     ➕ ADD ITEM
  ---------------------------- */
  const addItem = async (item: MerchandiseItem) => {
    setLoading(true);

    try {
      if (session?.user) {
        const res = await addToCartAction({
          userId: session.user.id,
          merchandiseId: item.id,
          quantity: 1,
        });

        if ("error" in res) {
          toast.error(res.error.message);
          return;
        }

        toast.success(`${item.title.toUpperCase()} added to cart`);
        router.refresh();
        return;
      }

      // guest flow
      setCart((prev) => {
        const safeItems = prev?.cartItems ?? [];

        const existing = safeItems.find(
          (i) => i.merchandise.id === item.id
        );

        let updatedItems: CartItem[];

        if (existing) {
          updatedItems = safeItems.map((i) =>
            i.merchandise.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          updatedItems = [
            ...safeItems,
            {
              id: crypto.randomUUID(),
              merchandise: item,
              quantity: 1,
            },
          ];
        }

        return {
          ...prev,
          cartItems: updatedItems,
        };
      });

      router.refresh();

      toast.success(`${item.title.toUpperCase()} added to cart`);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     ❌ REMOVE ITEM
  ---------------------------- */
  const removeItem = async (id: string) => {
    try {
      if (!isGuest) {
        const res = await deleteCartItem(id);

        if (!res || "error" in res) {
          toast.error("Failed to remove item");
          return;
        }

        toast.success("Item removed");
        router.refresh();
      } else {
        const stored = localStorage.getItem("tempCart");
        const parsed = safeParse<GuestCart>(stored);

        if (parsed) {
          const updated = parsed.filter(
            (item) => item.merchandiseId !== id
          );

          localStorage.setItem("tempCart", JSON.stringify(updated));
        }
      }

      setCart((prev) => ({
        ...prev,
        cartItems: prev?.cartItems?.filter((item) => item.id !== id),
      }));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------
     🔢 UPDATE QUANTITY
  ---------------------------- */
  const updateQuantity = async (id: string, newQty: number) => {
    setCart((prev) => ({
      ...prev,
      cartItems: prev?.cartItems?.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      ),
    }));

    if (isGuest) return;

    const res = await updateCartQuantity(id, newQty);

    if (!res || "error" in res) {
      toast.error("Failed to update quantity");
    } else {
      router.refresh();
    }
  };

  /* ---------------------------
     📊 CART META
  ---------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const { count, cartId } = await getCartMeta(session.user.id);
          setCount(count);
          setCartId(cartId);
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const stored = localStorage.getItem("tempCart");
      const items = safeParse<GuestCart>(stored);

      if (!items) {
        setCount(0);
        return;
      }

      const total = items.reduce((sum, i) => sum + i.quantity, 0);
      setCount(total);
    };

    fetchData();
  }, [session?.user?.id]);

  /* ---------------------------
     PROVIDER
  ---------------------------- */
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