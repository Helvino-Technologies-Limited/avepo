import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { SOCIAL_ICONS, socialHref } from "@/components/public/social-icons";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/smart-farm", label: "Smart Farm" },
  { href: "/knowledge-centre", label: "Knowledge Centre" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white">{children}</div>
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-[var(--brand-primary)]" />
    </div>
  );
}

export async function Footer() {
  const [branches, contact, social] = await Promise.all([
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getSiteSetting("contact.general"),
    getSiteSetting("social.links"),
  ]);

  const socialEntries = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="h-1.5 bg-[var(--brand-primary)]" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="text-lg font-bold text-white">Avepo Agrovets Limited</div>
            <p className="mt-1 text-sm italic text-[var(--brand-primary)]">Our Farms, Our Future</p>
            <p className="mt-2 text-sm">
              Agro-inputs, animal health, farm consultancy, and Smart Farm expertise for farmers
              across Kenya.
            </p>
          </div>

          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="mt-3 space-y-1.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[var(--brand-primary)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Branches</FooterHeading>
            <ul className="mt-3 space-y-1.5 text-sm">
              {branches.map((branch) => (
                <li key={branch.id}>
                  {branch.name}
                  {branch.phone ? ` — ${branch.phone}` : ""}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
            </ul>
          </div>

          <div>
            <FooterHeading>Follow Us</FooterHeading>
            {socialEntries.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Coming soon</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-3">
                {socialEntries.map(([platform, value]) => {
                  const Icon = SOCIAL_ICONS[platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={socialHref(platform, value)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:bg-[var(--brand-primary)] hover:text-neutral-900"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-800 pt-6">
          <div className="text-sm font-semibold text-white">Newsletter</div>
          <p className="mt-1 text-xs text-neutral-400">
            Get farming tips, product updates, and event alerts in your inbox.
          </p>
          <div className="mt-3 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-neutral-800 pt-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Avepo Agrovets Limited. All rights reserved.</span>
          <span>
            Website by{" "}
            <a href="https://helvino.org" target="_blank" rel="noreferrer" className="hover:text-neutral-300">
              Helvino Technologies Limited
            </a>{" "}
            · <a href="mailto:info@helvino.org" className="hover:text-neutral-300">info@helvino.org</a> · 0110 421 320
          </span>
        </div>
      </div>
    </footer>
  );
}
