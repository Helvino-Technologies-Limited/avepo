import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { approveReview, rejectReview, deleteReview } from "./actions";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Reviews</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Reviews only appear on the public site once approved here.
      </p>

      <div className="mt-6">
        <DataTable
          rows={reviews}
          emptyMessage="No reviews submitted yet."
          columns={[
            { header: "Product", render: (r) => r.product.name },
            { header: "Author", render: (r) => r.authorName },
            { header: "Rating", render: (r) => "★".repeat(r.rating) },
            { header: "Comment", render: (r) => <span className="line-clamp-2 max-w-xs">{r.comment}</span> },
            {
              header: "Status",
              render: (r) =>
                r.isApproved ? (
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
          rowActions={(r) => (
            <>
              {!r.isApproved ? (
                <form action={approveReview.bind(null, r.id)} className="inline">
                  <button className="text-green-700 hover:underline">Approve</button>
                </form>
              ) : (
                <form action={rejectReview.bind(null, r.id)} className="inline">
                  <button className="text-amber-700 hover:underline">Unapprove</button>
                </form>
              )}{" "}
              <DeleteButton action={deleteReview.bind(null, r.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
