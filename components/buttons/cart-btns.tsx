"use client";

import { useCart } from "@/context/cartContext";
import { ArchiveIcon, Loader2Icon } from "lucide-react";
import RemoveAlert from "../modals/alert";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@radix-ui/themes";

type Props = {
  item: {
    id: string;
    quantity: number;
  };
}

export const CartButtons = ({ item }: Props) => {

  const { cartLoading, updateQuantity, removeItem } = useCart();
  
  return (
    <div className="flex items-center justify-end gap-2">
      <input
        type="number"
        min="1"
        value={item.quantity}
        disabled={cartLoading}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!value || value < 1) return;
          updateQuantity(item.id, value);
        }}
        className="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 dark:bg-gray-400 text-center text-xs"
      />

      <RemoveAlert
        trigger={
          <button className="text-gray-600 dark:text-gray-300 hover:text-red-600">
            {cartLoading ? (
              <Loader2Icon size={16} className="animate-spin" />
              ) : (
                  "✕"
              )}
          </button>
        }
        title="Remove item from cart?"
        description="This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={() => removeItem(item.id)}
      />
    </div>
  );
}

export const CheckoutBtn = ({isEmpty, cartId }: { isEmpty: boolean; cartId: string; }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    if (isEmpty) return;

    if (!session?.user) {
      return signIn(undefined, { callbackUrl: "/store/cart" });
    }

    if (!cartId) return;

    router.replace(`/store/cart/${cartId}/checkout`);
  };

  return (
    <div className="flex justify-end">
      <button
        className="rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-gray-600 dark:text-zinc-300 dark:hover:bg-gray-400 dark:hover:text-gray-200 dark:disabled:cursor-not-allowed dark:disabled:hover:bg-gray-300 dark:disabled:hover:text-gray-500 disabled:pointer-events-none"
        disabled={isEmpty || !cartId}
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
}

export const OrderConfirmation = ({ id }: {  id: string }) => {
  const { update } = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await update();
    router.refresh();
  }

  return (
    <Tooltip content="Delete data">
      <RemoveAlert
        trigger={
          <button className="text-orange-600 hover:text-red-600">
            <ArchiveIcon className="w-4 h-auto" />
          </button>
        }
        title="Delete"
        description="Caution! This action cannot be undone."
        confirmText="Permanent Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete(id)}
      />
    </Tooltip>
  );
}