import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TipForm } from "../tip-form";
import { updateFarmerTip } from "../actions";

export default async function EditFarmerTipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = await prisma.farmerTip.findUnique({ where: { id } });
  if (!tip) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Farmer Tip</h1>
      <div className="mt-6 max-w-2xl">
        <TipForm action={updateFarmerTip.bind(null, id)} tip={tip} />
      </div>
    </div>
  );
}
