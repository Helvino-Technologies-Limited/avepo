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
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const logo = await getSiteSetting("branding.logo");

  return (
    <header className="relative border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-green-800">
          {logo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt="Avepo Enterprises" className="h-9 w-auto object-contain" />
          ) : (
            "Avepo"
          )}
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-green-800">
              {item.label}
            </Link>
          ))}
          <CartBadge />
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
