import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

function isRawVideoFile(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { media: { take: 1, orderBy: { order: "asc" }, where: { type: "IMAGE" } } },
  });
  if (!album) return {};

  const url = `${SITE_URL}/gallery/${album.id}`;
  const description = `${album.type.replaceAll("_", " ")} gallery from Avepo Enterprises Limited.`;
  const image = album.coverImage || album.media[0]?.url;
  const images = image ? [image] : undefined;

  return {
    title: `${album.title} | Avepo Gallery`,
    description,
    alternates: { canonical: url },
    openGraph: { title: album.title, description, url, images },
    twitter: { card: images ? "summary_large_image" : "summary", title: album.title, description, images },
  };
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
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Gallery", url: `${SITE_URL}/gallery` },
          { name: album.title, url: `${SITE_URL}/gallery/${album.id}` },
        ]}
      />
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
