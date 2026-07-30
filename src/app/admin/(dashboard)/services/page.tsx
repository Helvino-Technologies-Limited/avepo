import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { deleteService, toggleServiceActive } from "./actions";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Services</h1>
        <Link
          href="/admin/services/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Service
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={services}
          emptyMessage="No services yet. Add your first service above."
          editHref={(s) => `/admin/services/${s.id}`}
          columns={[
            { header: "Title", render: (s) => s.title },
            { header: "Featured", render: (s) => (s.isFeatured ? "Yes" : "No") },
            { header: "Active", render: (s) => (s.isActive ? "Yes" : "No") },
          ]}
          rowActions={(s) => (
            <>
              <ToggleButton
                isActive={s.isActive}
                action={toggleServiceActive.bind(null, s.id, s.isActive)}
              />{" "}
              <DeleteButton action={deleteService.bind(null, s.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
