"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { submitOrder } from "./actions";

type Branch = { id: string; name: string };

export function CartView({ branches }: { branches: Branch[] }) {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branchId, setBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
  const hasUnpriced = items.some((i) => i.price === null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitOrder({
      customerName,
      phone,
      email,
      branchId,
      notes,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setOrderId(result.orderId ?? null);
    clear();
  }

  if (orderId) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        <p className="font-medium">Order received — thank you!</p>
        <p className="mt-1">
          Our team will contact you shortly to confirm availability and pricing. Your reference
          number is <span className="font-mono">{orderId}</span>.
        </p>
        <Link href="/products" className="mt-4 inline-block text-green-700 underline">
          Continue browsing products
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        Your order cart is empty.{" "}
        <Link href="/products" className="text-green-700 underline">
          Browse products
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-14 w-14 rounded object-cover" />
              ) : (
                <div className="h-14 w-14 rounded bg-neutral-100" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                <div className="text-xs text-neutral-500">
                  {item.price ? `KES ${item.price} each` : "Price on inquiry"}
                </div>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm font-semibold text-neutral-900">
          Estimated Total: KES {total.toLocaleString()}
          {hasUnpriced && <span className="ml-1 font-normal text-neutral-500">(+ items priced on inquiry)</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Your Details</h2>
        <input
          placeholder="Full Name"
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Preferred pickup branch (optional)</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Additional notes (optional)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Order Request"}
        </button>
        <p className="text-xs text-neutral-500">
          This submits an order request — our team will call or email you to confirm availability
          and payment. No payment is collected online.
        </p>
      </form>
    </div>
  );
}
