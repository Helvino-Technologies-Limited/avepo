"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link href="/cart" className="relative hover:text-[var(--brand-primary-dark)]">
      Order Cart
      {totalCount > 0 && (
        <span className="ml-1 rounded-full bg-[var(--brand-primary)] px-1.5 py-0.5 text-xs text-white">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
