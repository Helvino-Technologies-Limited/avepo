import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { removeSubscriber } from "./actions";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Newsletter Subscribers</h1>
        <a
          href="/admin/subscribers/export"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6">
        <DataTable
          rows={subscribers}
          emptyMessage="No subscribers yet."
          columns={[
            { header: "Email", render: (s) => s.email },
            { header: "Active", render: (s) => (s.isActive ? "Yes" : "No") },
            { header: "Subscribed", render: (s) => s.subscribedAt.toLocaleDateString() },
          ]}
          rowActions={(s) => <DeleteButton action={removeSubscriber.bind(null, s.id)} />}
        />
      </div>
    </div>
  );
}
