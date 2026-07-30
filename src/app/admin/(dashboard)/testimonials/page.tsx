import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteTestimonial, toggleTestimonialActive } from "./actions";

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
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
            {
              header: "Status",
              render: (t) =>
                t.isActive ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    Approved
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Pending
                  </span>
                ),
            },
          ]}
          rowActions={(t) => (
            <>
              <ToggleButton
                isActive={t.isActive}
                action={toggleTestimonialActive.bind(null, t.id, t.isActive)}
              />{" "}
              <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
