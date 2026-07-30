import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { media: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Photos and videos from our events, products, Smart Farm, branches, and farmers."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {albums.length === 0 ? (
          <EmptyState message="No gallery photos yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {albums.map((album) => (
              <div key={album.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="text-xs uppercase text-[var(--brand-primary)]">{album.type}</div>
                <div className="font-medium text-neutral-900">{album.title}</div>
                <div className="text-sm text-neutral-500">{album._count.media} items</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
