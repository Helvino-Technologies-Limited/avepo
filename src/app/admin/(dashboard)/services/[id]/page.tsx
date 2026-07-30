import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ServiceForm } from "../service-form";
import { updateService } from "../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Service</h1>
      <div className="mt-6 max-w-2xl">
        <ServiceForm action={updateService.bind(null, id)} service={service} />
      </div>
    </div>
  );
}
