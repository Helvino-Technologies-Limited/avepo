import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { SavedBanner } from "@/components/admin/saved-banner";
import { deleteDownload, toggleDownloadActive } from "./actions";

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const downloads = await prisma.download.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <SavedBanner show={saved === "1"} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Downloads</h1>
        <Link
          href="/admin/downloads/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Download
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={downloads}
          emptyMessage="No downloads yet. Add your first one above."
          columns={[
            {
              header: "Title",
              render: (d) => (
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-green-700 underline">
                  {d.title}
                </a>
              ),
            },
            { header: "Category", render: (d) => d.category ?? "—" },
            { header: "Active", render: (d) => (d.isActive ? "Yes" : "No") },
          ]}
          rowActions={(d) => (
            <>
              <ToggleButton
                isActive={d.isActive}
                action={toggleDownloadActive.bind(null, d.id, d.isActive)}
              />{" "}
              <DeleteButton action={deleteDownload.bind(null, d.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
