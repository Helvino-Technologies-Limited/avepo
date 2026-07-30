import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function SmartFarmPage() {
  const sections = await prisma.smartFarmSection.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Smart Farm"
        subtitle="Demonstration Farm, Greenhouse, Dairy Unit, Poultry, and modern farming techniques."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {sections.length === 0 ? (
          <EmptyState message="Smart Farm content will appear here once added in the Admin Portal." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <div key={section.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-xs uppercase text-green-700">{section.type}</div>
                <div className="font-medium text-neutral-900">{section.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
