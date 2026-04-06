"use client";

import { redirect } from "next/navigation";

export const CancelOrder = ({ cartId }: { cartId: string }) => {
  return (
    <button 
      type="button"
      className="flex rounded-md px-2 py-1 bg-indigo-400 text-orange-600 items-center justify-end"
      onClick={() => redirect(`/store/cart/${cartId}`)}
    >
      Cancel Order
    </button>

  );
}
