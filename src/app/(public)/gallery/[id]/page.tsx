import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";

function isRawVideoFile(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!album) return {};
  return { title: `${album.title} | Avepo Gallery` };
}

export default async function GalleryAlbumPage({
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
    <div>
      <PageHeader title={album.title} subtitle={album.type.replaceAll("_", " ")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {album.media.length === 0 ? (
          <p className="text-sm text-neutral-500">No photos in this album yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {album.media.map((item) =>
              item.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.id}
                  src={item.url}
                  alt={item.caption ?? album.title}
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : isRawVideoFile(item.url) ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video key={item.id} controls className="h-40 w-full rounded-lg bg-black object-cover" src={item.url} />
              ) : (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-40 w-full items-center justify-center rounded-lg bg-neutral-900 text-sm text-white"
                >
                  ▶ Watch Video
                </a>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
