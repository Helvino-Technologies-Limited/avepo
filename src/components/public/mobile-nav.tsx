"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/smart-farm", label: "Smart Farm" },
  { href: "/knowledge-centre", label: "Knowledge Centre" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 text-neutral-700"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </button>

      {isOpen && (
        <nav className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-neutral-200 bg-white px-4 py-3 shadow-md">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-green-50 hover:text-[var(--brand-primary-dark)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-green-50 hover:text-[var(--brand-primary-dark)]"
          >
            Order Cart
            {totalCount > 0 && (
              <span className="rounded-full bg-[var(--brand-primary)] px-1.5 py-0.5 text-xs text-white">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      )}
    </div>
  );
}
