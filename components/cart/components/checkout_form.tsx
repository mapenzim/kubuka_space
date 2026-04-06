"use client";

import { checkoutAction } from "@/app/actions/cartActions.server";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";

export default function CheckoutForm({
  cartId,
  total,
}: {
  cartId: string;
  total: number;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    const result = await checkoutAction(formData);

    if (result.success) {
      setOrderId(result.orderId);
      setLoading(false);
      setOpen(true);
    } else {
      setLoading(false);
    }
  }

  return (
    <>
    <Form.Root
      action={handleCheckout}
      className="mx-auto max-w-md space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6"
    >
      <h3 className="text-2xl font-semibold mb-4">Billing Info</h3>

      {/* Hidden fields for cartId and total */}
      <input type="hidden" name="cartId" value={cartId} />
      <input type="hidden" name="total" value={total} />

      {/* Full Name */}
      <Form.Field name="fullName" className="flex flex-col">
        <Label.Root className="block text-sm font-medium text-gray-900">Full Name</Label.Root>
        <Form.Control asChild>
          <input
            required
            type="text"
            className="mt-1 w-full rounded-lg border p-2 focus:border-indigo-500 focus:outline-none"
            placeholder="John Doe"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
          Please enter your name
        </Form.Message>
      </Form.Field>

      {/* Email */}
      <Form.Field name="email" className="flex flex-col">
        <Label.Root className="block text-sm font-medium text-gray-900">Email</Label.Root>
        <Form.Control asChild>
          <input
            required
            type="email"
            className="mt-1 w-full rounded-lg p-2 border focus:border-indigo-500 focus:outline-none"
            placeholder="john@example.com"
          />
        </Form.Control>
        <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
          Please enter your email
        </Form.Message>
        <Form.Message match="typeMismatch" className="text-red-500 text-xs mt-1">
          Please provide a valid email
        </Form.Message>
      </Form.Field>

      <Form.Field name="street" className="flex flex-col">
        <Label.Root className="text-sm font-medium mb-1">Street</Label.Root>
        <Form.Control asChild>
          <input required type="text" className="rounded-lg border p-2 focus:border-indigo-500 focus:outline-none" />
        </Form.Control>
      </Form.Field>

      <Form.Field name="city" className="flex flex-col">
        <Label.Root className="text-sm font-medium mb-1">City</Label.Root>
        <Form.Control asChild>
          <input required type="text" className="rounded-lg border p-2 focus:border-indigo-500 focus:outline-none" />
        </Form.Control>
      </Form.Field>

      <Form.Field name="country" className="flex flex-col">
        <Label.Root className="text-sm font-medium mb-1">Country</Label.Root>
        <Form.Control asChild>
          <input required type="text" className="rounded-lg border p-2 focus:border-indigo-500 focus:outline-none" />
        </Form.Control>
      </Form.Field>

      {/* Submit */}
      <Form.Submit asChild>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-4 hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : `Proceed to Pay`}
        </button>
      </Form.Submit>
    </Form.Root>
      {/* ✅ Confirmation Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-2">
              Order Placed Successfully
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-4">
              Thank you for your purchase! Your order ID is{" "}
              <span className="font-mono font-bold">{orderId}</span>.
            </Dialog.Description>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}