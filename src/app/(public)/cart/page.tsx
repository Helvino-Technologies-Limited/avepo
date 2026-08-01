import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { CartView } from "./cart-view";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Cart",
  description: "Review your selected products and submit an order request to Avepo Agrovets Limited.",
  alternates: { canonical: `${SITE_URL}/cart` },
  robots: { index: false, follow: true },
};

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
