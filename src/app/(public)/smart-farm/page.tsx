import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { EmptyState } from "@/components/public/page-header";
import { ExpandableCard } from "@/components/public/expandable-card";
import { HeroVideo } from "@/components/public/hero-video";
import { SiteNav } from "@/components/public/site-nav";
import { SITE_URL } from "@/lib/site";

const TITLE = "Smart Farm";
const DESCRIPTION =
  "Explore Avepo Agrovets Limited's Demonstration Farm, Greenhouse, Dairy Unit, Poultry, and modern Smart Farm techniques in action.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/smart-farm` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/smart-farm` },
};

export default async function SmartFarmPage() {
  const [sections, hero] = await Promise.all([
    prisma.smartFarmSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getSiteSetting("smartfarm.hero"),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--brand-primary-dark)] text-center text-white">
        <HeroVideo videoUrl={hero.videoUrl} posterImage={hero.posterImage} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <SiteNav variant="overlay" />
          <div className="px-4 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              Avepo Agrovets Limited
            </p>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">Smart Farm</h1>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Demonstration Farm, Greenhouse, Dairy Unit, Poultry, and modern farming techniques.
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {sections.length === 0 ? (
          <EmptyState message="Smart Farm content is coming soon. Please check back." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <ExpandableCard
                key={section.id}
                summary={
                  <div>
                    {section.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={section.images[0]}
                        alt={section.title}
                        className="mb-3 h-32 w-full rounded object-cover"
                      />
                    )}
                    <div className="text-xs uppercase text-[var(--brand-primary)]">
                      {section.type.replaceAll("_", " ")}
                    </div>
                    <div className="font-medium text-neutral-900">{section.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">Click to read more</div>
                  </div>
                }
              >
                {section.description && (
                  <p className="text-sm text-neutral-700">{section.description}</p>
                )}

                {section.images.length > 1 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {section.images.slice(1).map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={url} src={url} alt="" className="h-20 w-full rounded object-cover" />
                    ))}
                  </div>
                )}

                {section.videos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {section.videos.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-[var(--brand-primary)] underline"
                      >
                        ▶ Watch Video
                      </a>
                    ))}
                  </div>
                )}
              </ExpandableCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
