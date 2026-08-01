import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { HeroVideo } from "@/components/public/hero-video";
import { SiteNav } from "@/components/public/site-nav";
import { Carousel, CarouselItem } from "@/components/public/carousel";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { TestimonialSubmitForm } from "@/components/public/testimonial-form";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">{children}</h2>
      <span className="mt-2 block h-1 w-12 rounded-full bg-[var(--brand-primary)]" />
    </div>
  );
}

export default async function HomePage() {
  const hero = await getSiteSetting("homepage.hero");

  const [
    featuredProducts,
    allServices,
    partners,
    testimonials,
    branchCount,
    productCount,
  ] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true, isActive: true }, take: 4 }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.branch.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { value: "15+", label: "Years of Experience" },
    { value: `${branchCount}+`, label: "Branches Serving Farmers" },
    { value: `${productCount}+`, label: "Products Stocked" },
    { value: `${allServices.length}+`, label: "Services Offered" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--brand-primary-dark)] text-center text-white">
        <HeroVideo videoUrl={hero.videoUrl} posterImage={hero.posterImage} />
        {/* Just enough of a dark scrim to keep text legible — the video stays
            natural/clear rather than being washed out in a solid brand color. */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <SiteNav variant="overlay" />
          <div className="px-4 py-28">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              Avepo Agrovets Limited
            </p>
            <h1 className="mx-auto mt-3 max-w-2xl animate-fade-in-up text-3xl font-bold sm:text-4xl">
              {hero.headline}
            </h1>
            <p className="animate-fade-in-up-delay mx-auto mt-3 max-w-xl text-sm font-medium italic text-[var(--brand-primary)]">
              Our Farms, Our Future
            </p>
            <p className="animate-fade-in-up-delay mx-auto mt-4 max-w-xl text-white/85">
              {hero.subheadline}
            </p>
            <Link
              href={hero.ctaHref}
              className="animate-fade-in-up-delay mt-6 inline-block rounded-md bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-[var(--brand-primary-dark)] shadow-lg transition hover:brightness-95"
            >
              {hero.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white px-4 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-[var(--brand-primary)] pl-4 text-left">
              <div className="text-2xl font-bold text-[var(--brand-primary-dark)] sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-neutral-500 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading>Featured Products</SectionHeading>
        {featuredProducts.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-700">
            New products are on their way — check back soon, or browse our full range.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="rounded-lg border border-neutral-200 p-3">
                <a href={`/products/${product.slug}`}>
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-28 w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded bg-neutral-100 text-xs text-neutral-400">
                      No image
                    </div>
                  )}
                  <div className="mt-2 text-sm font-medium text-neutral-900">{product.name}</div>
                </a>
                <div className="mt-2">
                  <AddToCartButton
                    productId={product.id}
                    name={product.name}
                    price={product.price ? Number(product.price) : null}
                    image={product.images[0] ?? null}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading>Our Services</SectionHeading>
          {allServices.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">
              Explore our full range of agricultural and veterinary services.
            </p>
          ) : (
            <div className="mt-4">
              <Carousel>
                {allServices.map((service) => (
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
                          className="h-28 w-full rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center rounded bg-neutral-100 text-2xl">
                          {service.icon || "🌾"}
                        </div>
                      )}
                      <div className="mt-2 font-medium text-neutral-900">{service.title}</div>
                      <div className="mt-1 text-xs text-[var(--brand-primary)]">Enquire now →</div>
                    </a>
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading>What Farmers Say</SectionHeading>
        {testimonials.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-700">
            No testimonials yet — be the first to share your experience below.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                {t.rating && (
                  <div className="text-xs text-[var(--brand-accent)]">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                )}
                <p className="mt-2 text-sm text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-3 flex items-center gap-2">
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs text-neutral-500">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{t.name}</div>
                    {t.role && <div className="text-xs text-neutral-500">{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 max-w-lg rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-semibold text-neutral-900">Share Your Experience</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Reviews are checked by our team before appearing publicly.
          </p>
          <div className="mt-3">
            <TestimonialSubmitForm />
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-xl font-semibold text-neutral-900">Our Partners</h2>
            <span className="mx-auto mt-2 block h-1 w-12 rounded-full bg-[var(--brand-primary)]" />
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
        </section>
      )}
    </div>
  );
}
