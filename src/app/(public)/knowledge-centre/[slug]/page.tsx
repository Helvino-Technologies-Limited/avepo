import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.knowledgeArticle.findUnique({ where: { slug } });
  if (!article) return {};

  return {
    title: `${article.title} | Avepo Knowledge Centre`,
    description: article.body?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.body?.slice(0, 160),
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.knowledgeArticle.findUnique({ where: { slug } });
  if (!article || !article.isPublished) notFound();

  return (
    <div>
      <PageHeader title={article.title} subtitle={article.category.replaceAll("_", " ")} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.coverImage} alt={article.title} className="w-full rounded-lg object-cover" />
        )}
        {article.body && <p className="mt-4 whitespace-pre-wrap text-neutral-800">{article.body}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {article.videoUrl && (
            <a
              href={article.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Watch Video
            </a>
          )}
          {article.pdfUrl && (
            <a
              href={article.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
