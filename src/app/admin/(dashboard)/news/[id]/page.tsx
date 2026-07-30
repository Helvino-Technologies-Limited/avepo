import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { NewsForm } from "../news-form";
import { updateNewsPost } from "../actions";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit News Post</h1>
      <div className="mt-6 max-w-2xl">
        <NewsForm action={updateNewsPost.bind(null, id)} post={post} />
      </div>
    </div>
  );
}
