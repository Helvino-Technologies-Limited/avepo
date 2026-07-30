import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteAlbum } from "./actions";

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { media: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Gallery Albums</h1>
        <Link
          href="/admin/gallery/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Album
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={albums}
          emptyMessage="No albums yet. Add your first album above."
          editHref={(a) => `/admin/gallery/${a.id}`}
          columns={[
            { header: "Title", render: (a) => a.title },
            { header: "Type", render: (a) => a.type.replaceAll("_", " ") },
            { header: "Items", render: (a) => a._count.media },
          ]}
          rowActions={(a) => <DeleteButton action={deleteAlbum.bind(null, a.id)} />}
        />
      </div>
    </div>
  );
}
