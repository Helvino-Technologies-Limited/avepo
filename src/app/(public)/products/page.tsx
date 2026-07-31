import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const TITLE = "Products";
const DESCRIPTION =
  "Browse our full range of fertilizers, seeds, herbicides, farm tools, veterinary products, and animal feeds — all from Avepo Enterprises Limited.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/products` },
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Products", url: `${SITE_URL}/products` },
        ]}
      />
      <PageHeader
        title="Products"
        subtitle="Fertilizers, seeds, herbicides, farm tools, veterinary products, and animal feeds."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {products.length === 0 ? (
          <EmptyState message="No products published yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border border-neutral-200 p-3">
                <Link href={`/products/${product.slug}`}>
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-32 w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded bg-neutral-100 text-xs text-neutral-400">
                      No image
                    </div>
                  )}
                  <div className="mt-2 text-xs text-neutral-500">{product.category?.name}</div>
                  <div className="font-medium text-neutral-900 hover:text-[var(--brand-primary-dark)]">
                    {product.name}
                  </div>
                </Link>
                {product.price && (
                  <div className="mt-1 text-sm font-semibold text-[var(--brand-primary-dark)]">
                    KES {product.price.toString()}
                  </div>
                )}
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
      </div>
    </div>
  );
}
