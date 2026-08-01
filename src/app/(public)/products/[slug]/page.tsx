import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { ReviewForm } from "@/components/public/review-form";
import { ProductSchema } from "@/components/public/product-schema";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SiteNav } from "@/components/public/site-nav";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};

  const url = `${SITE_URL}/products/${product.slug}`;
  const images = product.images[0] ? [product.images[0]] : undefined;

  return {
    title: product.name,
    description: product.description ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      url,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: product.name,
      description: product.description ?? undefined,
      images,
    },
  };
}

const STOCK_LABEL: Record<string, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isActive) notFound();

  const [relatedProducts, reviews] = await Promise.all([
    product.categoryId
      ? prisma.product.findMany({
          where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
          take: 4,
        })
      : Promise.resolve([]),
    prisma.review.findMany({
      where: { productId: product.id, isApproved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return (
    <div>
      <SiteNav variant="bar" />
      <div className="mx-auto max-w-6xl px-4 py-12">
      <ProductSchema
        product={{
          slug: product.slug,
          name: product.name,
          description: product.description,
          images: product.images,
          price: product.price ? Number(product.price) : null,
          manufacturer: product.manufacturer,
          stockStatus: product.stockStatus,
        }}
        avgRating={avgRating}
        reviewCount={reviews.length}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Products", url: `${SITE_URL}/products` },
          { name: product.name, url: `${SITE_URL}/products/${product.slug}` },
        ]}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
              No image
            </div>
          )}
          {product.images.length > 1 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.images.slice(1).map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="h-16 w-full rounded object-cover" />
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <div className="text-sm text-[var(--brand-primary)]">{product.category.name}</div>
          )}
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">{product.name}</h1>

          {avgRating && (
            <div className="mt-1 text-sm text-neutral-600">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))} ({reviews.length} review
              {reviews.length === 1 ? "" : "s"})
            </div>
          )}

          {product.price && (
            <div className="mt-3 text-xl font-semibold text-[var(--brand-primary-dark)]">
              KES {product.price.toString()}
            </div>
          )}

          <div className="mt-2 text-sm font-medium text-neutral-700">
            {STOCK_LABEL[product.stockStatus]}
          </div>

          {product.manufacturer && (
            <div className="mt-3 text-sm text-neutral-600">
              <span className="font-medium">Manufacturer:</span> {product.manufacturer}
            </div>
          )}

          {product.description && (
            <p className="mt-4 text-sm text-neutral-700">{product.description}</p>
          )}

          {product.usageInstructions && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-neutral-900">Usage Instructions</h2>
              <p className="mt-1 text-sm text-neutral-600">{product.usageInstructions}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price ? Number(product.price) : null}
              image={product.images[0] ?? null}
            />
            <a
              href="/contact"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Ask a Question
            </a>
            {product.brochureUrl && (
              <a
                href={product.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Download Brochure
              </a>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((p) => (
              <a key={p.id} href={`/products/${p.slug}`} className="rounded-lg border border-neutral-200 p-3">
                <div className="font-medium text-neutral-900">{p.name}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 border-t border-neutral-200 pt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-sm font-medium text-neutral-900">{review.authorName}</div>
                <div className="text-xs text-neutral-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="mt-1 text-sm text-neutral-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 max-w-lg">
          <h3 className="text-sm font-semibold text-neutral-900">Write a Review</h3>
          <p className="text-xs text-neutral-500">
            Reviews are checked by our team before appearing publicly.
          </p>
          <div className="mt-3">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
