import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteNewsPost } from "./actions";

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">News</h1>
        <Link
          href="/admin/news/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add News Post
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={posts}
          emptyMessage="No news posts yet. Add your first post above."
          editHref={(p) => `/admin/news/${p.id}`}
          columns={[
            { header: "Title", render: (p) => p.title },
            { header: "Category", render: (p) => p.category ?? "—" },
            { header: "Status", render: (p) => p.status },
            { header: "Featured", render: (p) => (p.isFeatured ? "Yes" : "No") },
          ]}
          rowActions={(p) => <DeleteButton action={deleteNewsPost.bind(null, p.id)} />}
        />
      </div>
    </div>
  );
}
