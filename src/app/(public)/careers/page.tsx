import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function CareersPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Careers"
        subtitle="Jobs, internships, and attachments at Avepo Enterprises."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {jobs.length === 0 ? (
          <EmptyState message="No open positions right now. Check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-xs uppercase text-[var(--brand-primary)]">{job.type}</div>
                <div className="font-medium text-neutral-900">{job.title}</div>
                {job.location && (
                  <div className="mt-1 text-sm text-neutral-500">{job.location}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
