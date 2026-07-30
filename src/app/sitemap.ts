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
    "/knowledge-centre",
    "/news",
    "/events",
    "/gallery",
    "/careers",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const [products, news, events, articles] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.newsPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.event.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.knowledgeArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: p.updatedAt })),
    ...news.map((n) => ({ url: `${SITE_URL}/news/${n.slug}`, lastModified: n.updatedAt })),
    ...events.map((e) => ({ url: `${SITE_URL}/events/${e.slug}`, lastModified: e.updatedAt })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/knowledge-centre/${a.slug}`,
      lastModified: a.updatedAt,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
