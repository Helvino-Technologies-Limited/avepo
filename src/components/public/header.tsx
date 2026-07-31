import Link from "next/link";
import { getSiteSetting } from "@/lib/settings";
import { CartBadge } from "@/components/public/cart-badge";
import { MobileNav } from "@/components/public/mobile-nav";

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
  { href: "/success-stories", label: "Success Stories" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const logo = await getSiteSetting("branding.logo");

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
          {logo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.url}
              alt="Avepo Enterprises Limited"
              className="h-10 w-auto shrink-0 object-contain sm:h-16"
            />
          ) : null}
          <span className="max-w-[8.5rem] truncate text-sm font-extrabold tracking-tight text-[#A8670B] sm:max-w-none sm:text-xl">
            Avepo Enterprises Limited
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--brand-primary-dark)]">
              {item.label}
            </Link>
          ))}
          <CartBadge />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {logo.secondaryUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.secondaryUrl}
              alt="Avepo Enterprises Limited partner badge"
              className="h-8 w-auto object-contain sm:h-14"
            />
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
