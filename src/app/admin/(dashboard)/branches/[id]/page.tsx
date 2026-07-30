import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BranchForm } from "../branch-form";
import { updateBranch } from "../actions";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Branch</h1>
      <div className="mt-6 max-w-2xl">
        <BranchForm action={updateBranch.bind(null, id)} branch={branch} />
      </div>
    </div>
  );
}
