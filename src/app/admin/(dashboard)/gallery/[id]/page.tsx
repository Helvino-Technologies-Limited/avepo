import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AlbumForm } from "../album-form";
import { AddMediaForm } from "../add-media-form";
import { updateAlbum, addMedia, deleteMedia } from "../actions";
import { DeleteButton } from "@/components/admin/row-actions";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!album) notFound();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Edit Album: {album.title}</h1>
        <div className="mt-6">
          <AlbumForm action={updateAlbum.bind(null, id)} album={album} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Media Items</h2>
        <div className="mt-3">
          <AddMediaForm action={addMedia.bind(null, id)} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {album.media.map((m) => (
            <div key={m.id} className="rounded-lg border border-neutral-200 p-2">
              {m.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.caption ?? ""} className="h-24 w-full rounded object-cover" />
              ) : (
                <div className="flex h-24 items-center justify-center rounded bg-neutral-100 text-xs text-neutral-500">
                  Video
                </div>
              )}
              {m.caption && <p className="mt-1 truncate text-xs text-neutral-600">{m.caption}</p>}
              <div className="mt-1">
                <DeleteButton action={deleteMedia.bind(null, id, m.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
