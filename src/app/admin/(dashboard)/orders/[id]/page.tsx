import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateOrderStatus } from "../actions";
import { StatusSelect } from "./status-select";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, branch: true },
  });
  if (!order) notFound();

  const total = order.items.reduce((sum, i) => sum + Number(i.price ?? 0) * i.quantity, 0);
  const replySubject = encodeURIComponent("Re: Your order request at Avepo");

  return (
    <div className="max-w-2xl">
      <Link href="/admin/orders" className="text-sm text-green-700 hover:underline">
        ← Back to Orders
      </Link>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-neutral-900">Order from {order.customerName}</h1>
        <p className="mt-1 text-sm text-neutral-500">{order.createdAt.toLocaleString()}</p>

        <dl className="mt-4 space-y-1 text-sm">
          <div>
            <dt className="inline font-medium text-neutral-700">Phone: </dt>
            <dd className="inline text-neutral-800">{order.phone}</dd>
          </div>
          {order.email && (
            <div>
              <dt className="inline font-medium text-neutral-700">Email: </dt>
              <dd className="inline text-neutral-800">{order.email}</dd>
            </div>
          )}
          {order.branch && (
            <div>
              <dt className="inline font-medium text-neutral-700">Preferred Branch: </dt>
              <dd className="inline text-neutral-800">{order.branch.name}</dd>
            </div>
          )}
          {order.notes && (
            <div>
              <dt className="inline font-medium text-neutral-700">Notes: </dt>
              <dd className="inline text-neutral-800">{order.notes}</dd>
            </div>
          )}
        </dl>

        <h2 className="mt-6 text-sm font-semibold text-neutral-900">Items</h2>
        <div className="mt-2 divide-y divide-neutral-100 rounded-md border border-neutral-200">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between px-3 py-2 text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{item.price ? `KES ${Number(item.price) * item.quantity}` : "Price on inquiry"}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-right text-sm font-semibold text-neutral-900">
          Estimated Total: KES {total.toLocaleString()}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusSelect status={order.status} action={updateOrderStatus.bind(null, id)} />

          <a
            href={`tel:${order.phone}`}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Call {order.phone}
          </a>
          {order.email && (
            <a
              href={`mailto:${order.email}?subject=${replySubject}`}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Reply by Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
