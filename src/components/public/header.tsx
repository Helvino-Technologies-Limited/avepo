import Link from "next/link";
import { getSiteSetting } from "@/lib/settings";

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
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-green-800">
          {logo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt="Avepo Enterprises" className="h-9 w-auto object-contain" />
          ) : (
            "Avepo"
          )}
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-green-800">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
