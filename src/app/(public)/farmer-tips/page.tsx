import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const TITLE = "Farmer Tips";
const DESCRIPTION =
  "Practical advice from Avepo Agrovets Limited on disease control, pest control, seed selection, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/farmer-tips` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/farmer-tips` },
};

export default async function FarmerTipsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [tips, categories] = await Promise.all([
    prisma.farmerTip.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.farmerTip.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categoryOptions = categories.map((c) => c.category!).filter(Boolean).sort();

  return (
    <div>
      <BreadcrumbSchema
        items={[{ name: "Home", url: SITE_URL }, { name: "Farmer Tips", url: `${SITE_URL}/farmer-tips` }]}
      />
      <PageHeader
        title="Farmer Tips"
        subtitle="Disease control, pest control, seed choices, and more — straight from our agronomists."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {categoryOptions.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 text-sm">
            <Link
              href="/farmer-tips"
              className={`rounded-full px-3 py-1 ${
                !category
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              All
            </Link>
            {categoryOptions.map((c) => (
              <Link
                key={c}
                href={`/farmer-tips?category=${encodeURIComponent(c)}`}
                className={`rounded-full px-3 py-1 ${
                  category === c
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {tips.length === 0 ? (
          <EmptyState message="No farmer tips yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tips.map((tip) => (
              <Link
                key={tip.id}
                href={`/farmer-tips/${tip.slug}`}
                className="block rounded-lg border border-neutral-200 p-4 hover:border-[var(--brand-primary)]"
              >
                {tip.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tip.images[0]}
                    alt={tip.title}
                    className="mb-3 h-32 w-full rounded object-cover"
                  />
                )}
                <div className="flex items-center gap-2 text-xs uppercase text-[var(--brand-primary)]">
                  {tip.category ?? "General"}
                  {tip.isFeatured && (
                    <span className="rounded-full bg-[var(--brand-accent)]/15 px-2 py-0.5 normal-case text-[var(--brand-primary-dark)]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="font-medium text-neutral-900">{tip.title}</div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{tip.body}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
