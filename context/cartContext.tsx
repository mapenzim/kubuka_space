"use client";

import {
  batchAddToCartAction,
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
  GuestCartItem,
  InitialCartInput,
  MerchandiseItem,
} from "@/lib/interfaces";
import { ulidId } from "@/lib/ulid";
import { debounceQuery } from "@/lib/utils";

/* ---------------------------
   🧱 CONSTANTS
---------------------------- */

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
  const [cartId, setCartId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [cartCountDistinct, setCountDistinct] = useState(0);
  const [cartCountTotal, setCountTotal] = useState(0);

  const mergedRef = useRef(false);

  /* ---------------------------
     🛠️ HELPERS
  ---------------------------- */
  // For guest carts: recalc counts from local state
  function updateCounts(items: CartItem[]) {
    setCountDistinct(items.length);
    setCountTotal(items.reduce((sum, i) => sum + i.quantity, 0));
  }

  // wrap your server fetch in debounce
  const updateCountsFromServer = debounceQuery(async (userId: string) => {
    const { distinctCount, totalCount, cartId } = await getCartMeta(userId);
    setCountDistinct(distinctCount);
    setCountTotal(totalCount);
    setCartId(cartId);
  }, 500); // half a second delay

  /* ---------------------------
    🧠 HYDRATE GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (initialCart) {
      setHydrated(true);
      setCartId(initialCart.id ?? null);
      return;
    }

    const storedItems = localStorage.getItem("tempCart");
    const storedId = localStorage.getItem("tempCartId");

    const items = safeParse<GuestCartItem[]>(storedItems);

    // Ensure cartId exists
    let id = storedId;
    if (!id) {
      id = ulidId();
      localStorage.setItem("tempCartId", id);
    }

    if (!items || items.length === 0) {
      localStorage.removeItem("tempCart");
      setCart({ ...emptyCart, id });
      setHydrated(true);
      setCartId(id);
      return;
    }

    const hydratedCart: Cart = {
      ...emptyCart,
      id,
      cartItems: items.map((item) => ({
        id: ulidId(),
        merchandise: item.merchandise,
        quantity: item.quantity,
      })),
    };

    setCart(hydratedCart);
    setHydrated(true);
    setCartId(id);
  }, [initialCart]);

  /* ---------------------------
    💾 PERSIST GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (!hydrated || !isGuest) return;

    // Only persist if user has never been authenticated in this session
    if (session?.user) return; // prevent writing DB cart back into localStorage

    const minimal: GuestCartItem[] = cart?.cartItems?.map((item) => ({
      merchandise: {
        id: item.merchandise.id,
        title: item.merchandise.title,
        body: item.merchandise.body,
        price: item.merchandise.price,
      },
      quantity: item.quantity,
    }));

    localStorage.setItem("tempCart", JSON.stringify(minimal));
    if (cartId) localStorage.setItem("tempCartId", cartId);
  }, [cart, hydrated, isGuest, cartId, session?.user]);

  /* ---------------------------
    🔄 MERGE GUEST CART ON LOGIN
  ---------------------------- */
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (!session?.user?.id || mergedRef.current) return;

      const storedItems = localStorage.getItem("tempCart");
      const storedId = localStorage.getItem("tempCartId");
      const guestItems = safeParse<GuestCartItem[]>(storedItems);

      if (!guestItems || guestItems.length === 0) return;

      // 🔑 Normalize into { merchandiseId, quantity }
      const normalizedItems = guestItems.map((i) => ({
        merchandiseId: i.merchandise.id,
        quantity: i.quantity,
      }));

      try {
        const res = await batchAddToCartAction({
          userId: session.user.id,
          cartId: storedId ?? undefined, // respect guest cartId
          items: normalizedItems,
        });

        if (res.success) {
          // cleanup localStorage
          localStorage.removeItem("tempCart");
          localStorage.removeItem("tempCartId");

          updateCountsFromServer(session.user.id); // ensure counts are accurate post-merge

          mergedRef.current = true;
          toast.success("Cart synced");
          router.refresh();
        } else {
          toast.error(res.error?.message ?? "Failed to merge cart");
        }
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
        const res = await batchAddToCartAction({
          userId: session.user.id,
          cartId: cartId || undefined,
          items: [{
            merchandiseId: item.id,
            quantity: 1
          }]
        });

        if ("error" in res) {
          toast.error(res?.error?.message);
          return;
        }

        // 🔑 Immediately refresh counts from server
        updateCountsFromServer(session.user.id);

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
              id: ulidId(),
              merchandise: item,
              quantity: 1,
            },
          ];
        }

        // recalc counts
        updateCounts(updatedItems);

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
        const parsed = safeParse<GuestCartItem[]>(stored);

        if (parsed) {
          const updated = parsed.filter(
            (item) => item.merchandise.id !== id
          );
          localStorage.setItem("tempCart", JSON.stringify(updated));
        }
      }

      // 🔑 Update cart state + counts
      setCart((prev) => {
        const updatedItems = prev?.cartItems?.filter((item) => item.id !== id) ?? [];

        // recalc counts
        updateCounts(updatedItems);

        return {
          ...prev,
          cartItems: updatedItems,
        };
      });

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
          updateCountsFromServer(session.user.id);
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const stored = localStorage.getItem("tempCart");
      const items = safeParse<CartItem[]>(stored);

      if (!items) {
        setCountDistinct(0);
        setCountTotal(0);
        return;
      }

      updateCounts(items);
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
        cartCountDistinct,
        cartCountTotal,
        cartId,
        isGuest,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);