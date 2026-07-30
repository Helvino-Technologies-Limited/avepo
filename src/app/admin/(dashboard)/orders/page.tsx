import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteOrder } from "./actions";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  FULFILLED: "bg-neutral-200 text-neutral-700",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, branch: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Order requests submitted through the public order cart.
      </p>

      <div className="mt-6">
        <DataTable
          rows={orders}
          emptyMessage="No orders yet."
          editHref={(o) => `/admin/orders/${o.id}`}
          columns={[
            { header: "Customer", render: (o) => o.customerName },
            { header: "Phone", render: (o) => o.phone },
            { header: "Items", render: (o) => o.items.length },
            { header: "Branch", render: (o) => o.branch?.name ?? "—" },
            {
              header: "Status",
              render: (o) => (
                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[o.status]}`}>
                  {o.status}
                </span>
              ),
            },
            { header: "Received", render: (o) => o.createdAt.toLocaleString() },
          ]}
          rowActions={(o) => <DeleteButton action={deleteOrder.bind(null, o.id)} />}
        />
      </div>
    </div>
  );
}
