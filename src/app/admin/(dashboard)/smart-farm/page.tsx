import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteSmartFarmSection } from "./actions";

export default async function SmartFarmAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const sections = await prisma.smartFarmSection.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Smart Farm</h1>
        <Link
          href="/admin/smart-farm/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Section
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={sections}
          emptyMessage="No Smart Farm sections yet. Add your first one above."
          editHref={(s) => `/admin/smart-farm/${s.id}`}
          columns={[
            { header: "Title", render: (s) => s.title },
            { header: "Type", render: (s) => s.type.replaceAll("_", " ") },
            { header: "Active", render: (s) => (s.isActive ? "Yes" : "No") },
          ]}
          rowActions={(s) => <DeleteButton action={deleteSmartFarmSection.bind(null, s.id)} />}
        />
      </div>
    </div>
  );
}
