import { SITE_URL } from "@/lib/site";

const AVAILABILITY: Record<string, string> = {
  IN_STOCK: "https://schema.org/InStock",
  LOW_STOCK: "https://schema.org/LimitedAvailability",
  OUT_OF_STOCK: "https://schema.org/OutOfStock",
};

type ProductSchemaProps = {
  product: {
    slug: string;
    name: string;
    description: string | null;
    images: string[];
    price: number | null;
    manufacturer: string | null;
    stockStatus: string;
  };
  avgRating: number | null;
  reviewCount: number;
};

export function ProductSchema({ product, avgRating, reviewCount }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(product.images.length > 0 ? { image: product.images } : {}),
    ...(product.manufacturer ? { brand: { "@type": "Brand", name: product.manufacturer } } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "KES",
      ...(product.price != null ? { price: product.price } : {}),
      availability: AVAILABILITY[product.stockStatus] ?? AVAILABILITY.IN_STOCK,
    },
    ...(avgRating != null && reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount,
          },
        }
      : {}),
  };

  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
