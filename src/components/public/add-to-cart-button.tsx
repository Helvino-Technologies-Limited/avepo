"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  productId,
  name,
  price,
  image,
}: {
  productId: string;
  name: string;
  price: number | null;
  image: string | null;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ productId, name, price, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand-primary-dark)]"
    >
      {added ? "Added ✓" : "Add to Order"}
    </button>
  );
}
