import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { Carousel, CarouselItem } from "@/components/public/carousel";
import { SITE_URL } from "@/lib/site";

const TITLE = "Services";
const DESCRIPTION =
  "Farm consultancy, soil testing, animal health, artificial insemination, training, and more from Avepo Enterprises Limited.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/services` },
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Farm consultancy, soil testing, animal health, artificial insemination, training, and more."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {services.length === 0 ? (
          <EmptyState message="No services published yet. Please check back soon." />
        ) : (
          <Carousel>
            {services.map((service) => (
              <CarouselItem key={service.id}>
                <a
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="block h-full rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-[var(--brand-primary)] hover:shadow-md"
                >
                  {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-32 w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded bg-neutral-100 text-2xl">
                      {service.icon || "🌾"}
                    </div>
                  )}
                  <div className="mt-3 font-medium text-neutral-900">{service.title}</div>
                  {service.description && (
                    <p className="mt-1 line-clamp-3 text-sm text-neutral-600">{service.description}</p>
                  )}
                  <div className="mt-2 text-xs text-[var(--brand-primary)]">Enquire now →</div>
                </a>
              </CarouselItem>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}
