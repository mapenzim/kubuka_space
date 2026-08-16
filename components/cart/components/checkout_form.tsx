"use client";

import { checkoutAction } from "@/app/actions/cartActions.server";
import { useCart } from "@/context/cartContext";
import * as Form from "@radix-ui/react-form";
import * as Label from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutForm({
  cartId,
}: {
  cartId: string;
}) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await checkoutAction(formData);
      clearCart();
      router.replace(`/store/receipt/${result.orderId}`);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "We could not complete your order. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <Form.Root
      action={handleCheckout}
      className="mx-auto max-w-md space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Delivery details</h3>

      {/* Totals are calculated on the server; only the cart identity is submitted. */}
      <input type="hidden" name="cartId" value={cartId} />

      <Form.Field name="fullName" className="flex flex-col text-zinc-700 dark:text-zinc-300">
        <Label.Root className="block text-sm font-medium">Full name</Label.Root>
        <Form.Control asChild>
          <input
            required
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="John Doe"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
          Please enter your name
        </Form.Message>
      </Form.Field>

      <Form.Field name="street" className="flex flex-col text-zinc-700 dark:text-zinc-300">
        <Label.Root className="text-sm font-medium mb-1">Street</Label.Root>
        <Form.Control asChild>
          <input 
            required 
            type="text"
            autoComplete="street-address"
            className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Street address"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="city" className="flex flex-col text-zinc-700 dark:text-zinc-300">
        <Label.Root className="text-sm font-medium mb-1">City</Label.Root>
        <Form.Control asChild>
          <input 
            required 
            type="text"
            autoComplete="address-level2"
            className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="City or town"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="country" className="flex flex-col text-zinc-700 dark:text-zinc-300">
        <Label.Root className="text-sm font-medium mb-1">Country</Label.Root>
        <Form.Control asChild>
          <input 
            required 
            type="text"
            autoComplete="country-name"
            className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Country"
          />
        </Form.Control>
      </Form.Field>

      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <Form.Submit asChild>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {loading ? "Completing order..." : "Complete order"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
