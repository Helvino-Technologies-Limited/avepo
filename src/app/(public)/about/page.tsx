import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { PageHeader } from "@/components/public/page-header";

export default async function AboutPage() {
  const [partners, about] = await Promise.all([
    prisma.partner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    getSiteSetting("about.content"),
  ]);

  return (
    <div>
      <PageHeader
        title="About Avepo Enterprises"
        subtitle="Serving farmers across Siaya County with agro-inputs, animal health, and Smart Farm expertise."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Vision</h2>
            <p className="mt-2 text-sm text-neutral-600">{about.vision}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Mission</h2>
            <p className="mt-2 text-sm text-neutral-600">{about.mission}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Commitment</h2>
            <p className="mt-2 text-sm text-neutral-600">{about.coreValues}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Why Choose Avepo</h2>
            <p className="mt-2 text-sm text-neutral-600">{about.whyChooseUs}</p>
          </div>
        </div>

        {partners.length > 0 && (
          <div className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-lg font-semibold text-neutral-900">Our Partners & Suppliers</h2>
            <div className="mt-6 grid grid-cols-3 items-center gap-6 sm:grid-cols-5 md:grid-cols-6">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center" title={partner.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 w-full object-contain grayscale transition hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
