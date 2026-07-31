import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const TITLE = "News";
const DESCRIPTION =
  "New products, weather alerts, government updates, farmer success stories, and promotions from Avepo Enterprises Limited.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/news` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/news` },
};

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishAt: "desc" },
  });

  return (
    <div>
      <BreadcrumbSchema items={[{ name: "Home", url: SITE_URL }, { name: "News", url: `${SITE_URL}/news` }]} />
      <PageHeader
        title="News"
        subtitle="New products, weather alerts, government updates, farmer success stories, and promotions."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? (
          <EmptyState message="No news published yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="block rounded-lg border border-neutral-200 p-4 hover:border-[var(--brand-primary)]"
              >
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="mb-3 h-32 w-full rounded object-cover"
                  />
                )}
                {post.category && (
                  <div className="text-xs uppercase text-[var(--brand-primary)]">{post.category}</div>
                )}
                <div className="font-medium text-neutral-900">{post.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
