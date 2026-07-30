import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteTestimonial } from "./actions";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={testimonials}
          emptyMessage="No testimonials yet. Add your first testimonial above."
          editHref={(t) => `/admin/testimonials/${t.id}`}
          columns={[
            { header: "Name", render: (t) => t.name },
            { header: "Role", render: (t) => t.role ?? "—" },
            { header: "Rating", render: (t) => t.rating ?? "—" },
            { header: "Active", render: (t) => (t.isActive ? "Yes" : "No") },
          ]}
          rowActions={(t) => <DeleteButton action={deleteTestimonial.bind(null, t.id)} />}
        />
      </div>
    </div>
  );
}
