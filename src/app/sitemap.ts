import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/products",
    "/services",
    "/smart-farm",
    "/events",
    "/gallery",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const [products, events] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: p.updatedAt })),
    ...events.map((e) => ({ url: `${SITE_URL}/events/${e.slug}`, lastModified: e.updatedAt })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
