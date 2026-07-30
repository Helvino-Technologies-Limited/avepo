import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteBranch } from "./actions";

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const branches = await prisma.branch.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Branches</h1>
        <Link
          href="/admin/branches/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Branch
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={branches}
          emptyMessage="No branches yet. Add your first one above."
          editHref={(b) => `/admin/branches/${b.id}`}
          columns={[
            { header: "Name", render: (b) => b.name },
            { header: "Phone", render: (b) => b.phone ?? "—" },
            { header: "Active", render: (b) => (b.isActive ? "Yes" : "No") },
          ]}
          rowActions={(b) => <DeleteButton action={deleteBranch.bind(null, b.id)} />}
        />
      </div>
    </div>
  );
}
