"use client";

import {
  batchAddToCartAction,
  deleteCartItem,
  getCurrentUserCart,
  updateCartQuantity,
} from "@/app/actions/cartActions.server";

import { safeParse } from "@/lib/safe-parse";
import { useSession } from "next-auth/react";
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { ulidId } from "@/lib/ulid";
import { Cart, CartItem, emptyCart, GuestCartItem, InitialCartInput, MerchandiseItem } from "@/lib/type_interface";

/* ---------------------------
   🧱 CONSTANTS
---------------------------- */

/* ---------------------------
   CONTEXT
---------------------------- */
type CartContextValue = {
  cart: Cart;
  addItem(item: MerchandiseItem): Promise<void>;
  removeItem(id: string): Promise<void>;
  updateQuantity(id: string, quantity: number): Promise<void>;
  cartLoading: boolean;
  cartCountDistinct: number;
  cartCountTotal: number;
  cartId: string | null;
  isGuest: boolean;
  clearCart(): void;
};

const CartContext = createContext<CartContextValue | null>(null);


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
  const { data: session, status } = useSession();

  const isGuest = status === "unauthenticated";

  const [cart, setCart] = useState<Cart>(normalizeCart(initialCart));
  const [cartLoading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(Boolean(initialCart));

  const mergedRef = useRef(false);

  /* ---------------------------
     🛠️ HELPERS
  ---------------------------- */
  const clearCart = useCallback(() => {
    setCart((currentCart) => ({
      ...currentCart,
      cartItems: [],
    }));
  }, []);

  const cartCountDistinct = cart.cartItems.length;
  const cartCountTotal = useMemo(
    () => cart.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cart.cartItems],
  );
  const cartId = hydrated && cart.id !== "guest" ? cart.id : null;

  /* ---------------------------
    🧠 HYDRATE GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (status === "loading") return;
    if (initialCart) return;

    let active = true;
    const hydrate = async () => {
      if (session?.user?.id) {
        const pendingGuestItems = safeParse<GuestCartItem[]>(
          localStorage.getItem("tempCart"),
        );
        if (pendingGuestItems?.length) return;

        const serverCart = await getCurrentUserCart();
        if (active) {
          setCart(serverCart ? serverCart as Cart : emptyCart);
          setHydrated(true);
        }
        return;
      }

      mergedRef.current = false;
      await Promise.resolve();
      const storedItems = localStorage.getItem("tempCart");
      const storedId = localStorage.getItem("tempCartId");
      const items = safeParse<GuestCartItem[]>(storedItems);
      const id = storedId ?? ulidId();

      if (!storedId) localStorage.setItem("tempCartId", id);
      if (!items?.length) localStorage.removeItem("tempCart");
      if (!active) return;

      setCart({
        ...emptyCart,
        id,
        cartItems: (items ?? []).map((item) => ({
          id: ulidId(),
          merchandise: item.merchandise,
          quantity: item.quantity,
        })),
      });
      setHydrated(true);
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, [initialCart, session?.user?.id, status]);

  /* ---------------------------
    💾 PERSIST GUEST CART
  ---------------------------- */
  useEffect(() => {
    if (!hydrated || !isGuest) return;

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
  }, [cart, hydrated, isGuest, cartId]);

  /* ---------------------------
    🔄 MERGE GUEST CART ON LOGIN
  ---------------------------- */
  useEffect(() => {
    let active = true;
    const mergeGuestCart = async () => {
      if (!session?.user?.id || mergedRef.current) return;

      const storedItems = localStorage.getItem("tempCart");
      const storedId = localStorage.getItem("tempCartId");
      const guestItems = safeParse<GuestCartItem[]>(storedItems);

      if (!guestItems || guestItems.length === 0) return;
      mergedRef.current = true;

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

        if (res.success && res.cart) {
          // cleanup localStorage
          localStorage.removeItem("tempCart");
          localStorage.removeItem("tempCartId");

          if (!active) return;
          setCart(res.cart as Cart);
          setHydrated(true);
          toast.success("Cart synced");
        } else {
          mergedRef.current = false;
          const serverCart = await getCurrentUserCart();
          if (!active) return;
          setCart(serverCart ? serverCart as Cart : emptyCart);
          setHydrated(true);
          toast.error(res.error?.message ?? "Failed to merge cart");
        }
      } catch (err) {
        mergedRef.current = false;
        const serverCart = await getCurrentUserCart();
        if (!active) return;
        setCart(serverCart ? serverCart as Cart : emptyCart);
        setHydrated(true);
        console.error(err);
        toast.error("Failed to merge cart");
      }
    };

    void mergeGuestCart();
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  /* ---------------------------
     ➕ ADD ITEM
  ---------------------------- */
  const addItem = useCallback(async (item: MerchandiseItem) => {
    if (status === "loading") return;
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

        if (res.cart) {
          setCart(res.cart as Cart);
        }

        toast.success(`${item.title.toUpperCase()} added to cart`);
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

        return {
          ...prev,
          cartItems: updatedItems,
        };
      });

      toast.success(`${item.title.toUpperCase()} added to cart`);
    } finally {
      setLoading(false);
    }
  }, [cartId, session?.user, status]);

  /* ---------------------------
    ❌ REMOVE ITEM
  ---------------------------- */
  const removeItem = useCallback(async (id: string) => {
    if (status === "loading") return;
    try {
      if (!isGuest) {
        const res = await deleteCartItem(id);

        if (!res || "error" in res) {
          toast.error("Failed to remove item");
          return;
        }

        toast.success("Item removed");
      }

      setCart((prev) => {
        const updatedItems = prev?.cartItems?.filter((item) => item.id !== id) ?? [];

        return {
          ...prev,
          cartItems: updatedItems,
        };
      });
    } catch (err) {
      console.error(err);
    }
  }, [isGuest, status]);

  /* ---------------------------
     🔢 UPDATE QUANTITY
  ---------------------------- */
  const updateQuantity = useCallback(async (id: string, newQty: number) => {
    if (status === "loading" || !Number.isInteger(newQty) || newQty < 1) return;
    const previousQuantity = cart.cartItems.find((item) => item.id === id)?.quantity;

    setCart((prev) => ({
      ...prev,
      cartItems: prev?.cartItems?.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      ),
    }));

    if (isGuest) return;

    const res = await updateCartQuantity(id, newQty);

    if (!res || "error" in res) {
      if (previousQuantity !== undefined) {
        setCart((prev) => ({
          ...prev,
          cartItems: prev.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: previousQuantity } : item,
          ),
        }));
      }
      toast.error("Failed to update quantity");
    }
  }, [cart.cartItems, isGuest, status]);

  const value = useMemo<CartContextValue>(() => ({
    cart,
    addItem,
    removeItem,
    updateQuantity,
    cartLoading,
    cartCountDistinct,
    cartCountTotal,
    cartId,
    isGuest,
    clearCart,
  }), [
    cart,
    addItem,
    removeItem,
    updateQuantity,
    cartLoading,
    cartCountDistinct,
    cartCountTotal,
    cartId,
    isGuest,
    clearCart,
  ]);

  /* ---------------------------
     PROVIDER
  ---------------------------- */
  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
};
