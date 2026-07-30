import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteSuccessStory, toggleSuccessStoryActive } from "./actions";

export default async function SuccessStoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const stories = await prisma.successStory.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Success Stories</h1>
        <Link
          href="/admin/success-stories/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Success Story
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={stories}
          emptyMessage="No success stories yet. Add your first one above."
          editHref={(s) => `/admin/success-stories/${s.id}`}
          columns={[
            { header: "Title", render: (s) => s.title },
            { header: "Farmer", render: (s) => s.farmerName },
            {
              header: "Status",
              render: (s) =>
                s.isActive ? (
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
          rowActions={(s) => (
            <>
              <ToggleButton
                isActive={s.isActive}
                action={toggleSuccessStoryActive.bind(null, s.id, s.isActive)}
              />{" "}
              <DeleteButton action={deleteSuccessStory.bind(null, s.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
