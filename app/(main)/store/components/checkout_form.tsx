"use client";

import { useState } from "react";

export default function CheckoutForm({
  cartId,
  total,
}: {
  cartId: number;
  total: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Example POST request
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Payment successful!");
    } else {
      alert("Payment failed");
    }
  }

  return (
    <form
      onSubmit={handleCheckout}
      className="space-y-4 border p-6 rounded-xl bg-gray-100"
    >
      <h3 className="text-xl font-medium mb-2">Payment Details</h3>

      <div className="flex flex-col">
        <label className="text-sm mb-1">Full Name</label>
        <input
          required
          type="text"
          className="border p-2 rounded-md"
          placeholder="John Doe"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm mb-1">Email</label>
        <input
          required
          type="email"
          className="border p-2 rounded-md"
          placeholder="john@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl mt-4 hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}
