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
          <EmptyState message="No news published yet. Publish news from the Admin Portal." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-neutral-200 p-4">
                {post.category && (
                  <div className="text-xs uppercase text-green-700">{post.category}</div>
                )}
                <div className="font-medium text-neutral-900">{post.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
