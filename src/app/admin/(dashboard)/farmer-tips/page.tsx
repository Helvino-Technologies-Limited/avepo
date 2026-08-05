import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteFarmerTip, toggleFarmerTipActive } from "./actions";

export default async function FarmerTipsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const tips = await prisma.farmerTip.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Farmer Tips</h1>
        <Link
          href="/admin/farmer-tips/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Tip
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={tips}
          emptyMessage="No farmer tips yet. Add your first one above."
          editHref={(t) => `/admin/farmer-tips/${t.id}`}
          columns={[
            { header: "Title", render: (t) => t.title },
            { header: "Category", render: (t) => t.category ?? "—" },
            { header: "Comments", render: (t) => t._count.comments },
            { header: "Featured", render: (t) => (t.isFeatured ? "Yes" : "No") },
            { header: "Active", render: (t) => (t.isActive ? "Yes" : "No") },
          ]}
          rowActions={(t) => (
            <>
              <ToggleButton isActive={t.isActive} action={toggleFarmerTipActive.bind(null, t.id, t.isActive)} />{" "}
              <DeleteButton action={deleteFarmerTip.bind(null, t.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
