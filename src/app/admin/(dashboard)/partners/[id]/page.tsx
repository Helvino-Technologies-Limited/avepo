import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PartnerForm } from "../partner-form";
import { updatePartner } from "../actions";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Partner</h1>
      <div className="mt-6 max-w-2xl">
        <PartnerForm action={updatePartner.bind(null, id)} partner={partner} />
      </div>
    </div>
  );
}
