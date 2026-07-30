import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { FloatingWhatsApp } from "@/components/public/floating-whatsapp";
import { GoogleAnalytics } from "@/components/public/google-analytics";
import { CookieConsent } from "@/components/public/cookie-consent";
import { CartProvider } from "@/lib/cart-context";
import { getSiteSetting } from "@/lib/settings";

// Content here comes from the admin-editable database (branches, products,
// news, events, settings), so every public route must render fresh on each
// request rather than being baked into a static page at build time.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const theme = await getSiteSetting("theme.colors");

  return (
    <CartProvider>
      <div
        className="flex min-h-full flex-1 flex-col"
        style={
          {
            "--brand-primary": theme.primary,
            "--brand-primary-dark": theme.secondary,
            "--brand-accent": theme.accent,
          } as React.CSSProperties
        }
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <GoogleAnalytics />
        <CookieConsent />
      </div>
    </CartProvider>
  );
}
