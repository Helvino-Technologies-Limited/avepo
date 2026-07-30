import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function KnowledgeCentrePage() {
  const articles = await prisma.knowledgeArticle.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Agricultural Knowledge Centre"
        subtitle="Crop production, livestock, soil health, pest management, and climate-smart agriculture."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {articles.length === 0 ? (
          <EmptyState message="No articles published yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/knowledge-centre/${article.slug}`}
                className="block rounded-lg border border-neutral-200 p-4 hover:border-green-300"
              >
                {article.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="mb-3 h-32 w-full rounded object-cover"
                  />
                )}
                <div className="text-xs uppercase text-[var(--brand-primary)]">
                  {article.category.replaceAll("_", " ")}
                </div>
                <div className="font-medium text-neutral-900">{article.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
