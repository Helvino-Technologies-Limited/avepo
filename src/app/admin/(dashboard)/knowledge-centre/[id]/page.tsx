import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "../article-form";
import { updateArticle } from "../actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.knowledgeArticle.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Article</h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm action={updateArticle.bind(null, id)} article={article} />
      </div>
    </div>
  );
}
