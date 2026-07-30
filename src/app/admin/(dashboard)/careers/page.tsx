import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteJob } from "./actions";

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const jobs = await prisma.jobPosting.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Careers</h1>
        <Link
          href="/admin/careers/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Job Posting
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={jobs}
          emptyMessage="No job postings yet. Add your first one above."
          editHref={(j) => `/admin/careers/${j.id}`}
          columns={[
            { header: "Title", render: (j) => j.title },
            { header: "Type", render: (j) => j.type },
            { header: "Location", render: (j) => j.location ?? "—" },
            { header: "Active", render: (j) => (j.isActive ? "Yes" : "No") },
          ]}
          rowActions={(j) => <DeleteButton action={deleteJob.bind(null, j.id)} />}
        />
      </div>
    </div>
  );
}
