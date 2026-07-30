import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { CartView } from "./cart-view";

export default async function CartPage() {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <PageHeader title="Your Order Cart" subtitle="Review your items and submit an order request." />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <CartView branches={branches} />
      </div>
    </div>
  );
}
