import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Farm consultancy, soil testing, animal health, artificial insemination, training, and more."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {services.length === 0 ? (
          <EmptyState message="No services published yet. Add services from the Admin Portal." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="font-medium text-neutral-900">{service.title}</div>
                {service.description && (
                  <p className="mt-1 text-sm text-neutral-600">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
