import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SectionForm } from "../section-form";
import { updateSmartFarmSection } from "../actions";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const section = await prisma.smartFarmSection.findUnique({ where: { id } });
  if (!section) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Smart Farm Section</h1>
      <div className="mt-6 max-w-2xl">
        <SectionForm action={updateSmartFarmSection.bind(null, id)} section={section} />
      </div>
    </div>
  );
}
