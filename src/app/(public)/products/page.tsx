import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Fertilizers, seeds, herbicides, farm tools, veterinary products, and animal feeds."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {products.length === 0 ? (
          <EmptyState message="No products published yet. Add products from the Admin Portal." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-sm text-neutral-500">{product.category?.name}</div>
                <div className="font-medium text-neutral-900">{product.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
