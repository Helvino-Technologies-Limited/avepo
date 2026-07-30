import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { HeroVideo } from "@/components/public/hero-video";
import { Carousel, CarouselItem } from "@/components/public/carousel";
import { AddToCartButton } from "@/components/public/add-to-cart-button";

export default async function HomePage() {
  const hero = await getSiteSetting("homepage.hero");

  const [featuredProducts, featuredServices, latestNews, partners] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true, isActive: true }, take: 4 }),
    prisma.service.findMany({ where: { isFeatured: true, isActive: true }, take: 3 }),
    prisma.newsPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishAt: "desc" },
      take: 3,
    }),
    prisma.partner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-green-800 px-4 py-28 text-center text-white">
        <HeroVideo videoUrl={hero.videoUrl} posterImage={hero.posterImage} />
        <div className="absolute inset-0 bg-green-900/60" />
        <div className="relative">
          <h1 className="mx-auto max-w-2xl animate-fade-in-up text-3xl font-bold sm:text-4xl">
            {hero.headline}
          </h1>
          <p className="animate-fade-in-up-delay mx-auto mt-4 max-w-xl text-green-100">
            {hero.subheadline}
          </p>
          <Link
            href={hero.ctaHref}
            className="animate-fade-in-up-delay mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            {hero.ctaLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-900">Featured Products</h2>
        {featuredProducts.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">
            Featured products will appear here once added in the Admin Portal.
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
          <h2 className="text-xl font-semibold text-neutral-900">Featured Services</h2>
          {featuredServices.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">
              Featured services will appear here once added in the Admin Portal.
            </p>
          ) : (
            <div className="mt-4">
              <Carousel>
                {featuredServices.map((service) => (
                  <CarouselItem key={service.id}>
                    <div className="h-full rounded-lg border border-neutral-200 bg-white p-4">
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
                    </div>
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-900">Latest News</h2>
        {latestNews.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">
            Published news will appear here once posted in the Admin Portal.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {latestNews.map((post) => (
              <div key={post.id} className="rounded-lg border border-neutral-200 p-4">
                {post.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {partners.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-xl font-semibold text-neutral-900">Our Partners</h2>
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
