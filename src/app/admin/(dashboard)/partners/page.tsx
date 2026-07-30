import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deletePartner, togglePartnerActive } from "./actions";

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Partner
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={partners}
          emptyMessage="No partners yet. Add your first one above."
          editHref={(p) => `/admin/partners/${p.id}`}
          columns={[
            {
              header: "Logo",
              // eslint-disable-next-line @next/next/no-img-element
              render: (p) => <img src={p.logo} alt={p.name} className="h-8 w-8 rounded object-contain" />,
            },
            { header: "Name", render: (p) => p.name },
            { header: "Active", render: (p) => (p.isActive ? "Yes" : "No") },
          ]}
          rowActions={(p) => (
            <>
              <ToggleButton
                isActive={p.isActive}
                action={togglePartnerActive.bind(null, p.id, p.isActive)}
              />{" "}
              <DeleteButton action={deletePartner.bind(null, p.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
