import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishAt: "desc" },
  });

  return (
    <div>
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
                className="block rounded-lg border border-neutral-200 p-4 hover:border-green-300"
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
