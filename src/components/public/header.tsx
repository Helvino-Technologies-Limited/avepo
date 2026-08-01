import Link from "next/link";
import { getSiteSetting } from "@/lib/settings";
import { MobileNav } from "@/components/public/mobile-nav";

export async function Header() {
  const logo = await getSiteSetting("branding.logo");

  return (
    <header className="sticky top-0 z-50 bg-[var(--brand-primary)] shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          {logo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.url}
              alt="Avepo Agrovets Limited"
              className="h-10 w-auto object-contain sm:h-14"
            />
          ) : null}
        </Link>

        <Link
          href="/"
          className="min-w-0 flex-1 truncate text-center text-lg font-black uppercase tracking-wide text-[var(--brand-primary-dark)] sm:text-2xl md:text-3xl"
        >
          Avepo Agrovets Limited
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {logo.secondaryUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.secondaryUrl}
              alt="Avepo Agrovets Limited partner badge"
              className="h-8 w-auto object-contain sm:h-12"
            />
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
