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
          <EmptyState message="No articles published yet. Add articles from the Admin Portal." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-xs uppercase text-green-700">
                  {article.category.replaceAll("_", " ")}
                </div>
                <div className="font-medium text-neutral-900">{article.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
