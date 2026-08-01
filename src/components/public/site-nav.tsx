import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav-items";
import { CartBadge } from "@/components/public/cart-badge";

/**
 * "bar" sits as a normal opaque strip under the header on pages without a
 * hero. "overlay" is meant to be placed inside a hero section (home,
 * smart-farm) so navigation reads as part of the video banner itself.
 */
export function SiteNav({ variant = "bar" }: { variant?: "bar" | "overlay" }) {
  const isOverlay = variant === "overlay";

  return (
    <nav
      className={
        isOverlay
          ? "relative z-10 hidden flex-wrap items-center justify-center gap-x-6 gap-y-1 border-b border-white/20 px-4 py-3 text-sm font-medium text-white md:flex"
          : "hidden flex-wrap items-center justify-center gap-x-6 gap-y-1 border-b border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 md:flex"
      }
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isOverlay ? "hover:text-[var(--brand-primary)]" : "hover:text-[var(--brand-primary-dark)]"}
        >
          {item.label}
        </Link>
      ))}
      <CartBadge />
    </nav>
  );
}
