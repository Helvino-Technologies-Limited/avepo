import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { JobForm } from "../job-form";
import { updateJob } from "../actions";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Job Posting</h1>
      <div className="mt-6 max-w-2xl">
        <JobForm action={updateJob.bind(null, id)} job={job} />
      </div>
    </div>
  );
}
