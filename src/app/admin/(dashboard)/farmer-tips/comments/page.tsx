import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { approveTipComment, rejectTipComment, deleteTipComment } from "./actions";

export default async function TipCommentsPage() {
  const comments = await prisma.tipComment.findMany({
    include: { tip: { select: { title: true } } },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Tip Comments</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Comments only appear on the public site once approved here.
      </p>

      <div className="mt-6">
        <DataTable
          rows={comments}
          emptyMessage="No comments submitted yet."
          columns={[
            { header: "Tip", render: (c) => c.tip.title },
            { header: "Author", render: (c) => c.authorName },
            { header: "Rating", render: (c) => (c.rating ? "★".repeat(c.rating) : "—") },
            { header: "Comment", render: (c) => <span className="line-clamp-2 max-w-xs">{c.comment}</span> },
            {
              header: "Status",
              render: (c) =>
                c.isApproved ? (
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
          rowActions={(c) => (
            <>
              {!c.isApproved ? (
                <form action={approveTipComment.bind(null, c.id)} className="inline">
                  <button className="text-green-700 hover:underline">Approve</button>
                </form>
              ) : (
                <form action={rejectTipComment.bind(null, c.id)} className="inline">
                  <button className="text-amber-700 hover:underline">Unapprove</button>
                </form>
              )}{" "}
              <DeleteButton action={deleteTipComment.bind(null, c.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
