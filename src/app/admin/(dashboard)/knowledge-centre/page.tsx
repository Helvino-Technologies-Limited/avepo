import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteArticle } from "./actions";

export default async function KnowledgeCentreAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const articles = await prisma.knowledgeArticle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Knowledge Centre</h1>
        <Link
          href="/admin/knowledge-centre/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Article
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={articles}
          emptyMessage="No articles yet. Add your first article above."
          editHref={(a) => `/admin/knowledge-centre/${a.id}`}
          columns={[
            { header: "Title", render: (a) => a.title },
            { header: "Category", render: (a) => a.category.replaceAll("_", " ") },
            { header: "Published", render: (a) => (a.isPublished ? "Yes" : "No") },
          ]}
          rowActions={(a) => <DeleteButton action={deleteArticle.bind(null, a.id)} />}
        />
      </div>
    </div>
  );
}
