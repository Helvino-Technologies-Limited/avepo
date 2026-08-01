import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const TITLE = "Gallery";
const DESCRIPTION =
  "Browse photos and videos from Avepo Agrovets Limited events, products, Smart Farm demonstrations, branches, and the farmers we serve.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/gallery` },
};

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { media: true } },
      media: { take: 1, orderBy: { order: "asc" }, where: { type: "IMAGE" } },
    },
  });

  return (
    <div>
      <BreadcrumbSchema items={[{ name: "Home", url: SITE_URL }, { name: "Gallery", url: `${SITE_URL}/gallery` }]} />
      <PageHeader
        title="Gallery"
        subtitle="Photos and videos from our events, products, Smart Farm, branches, and farmers."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {albums.length === 0 ? (
          <EmptyState message="No gallery photos yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {albums.map((album) => {
              const cover = album.coverImage || album.media[0]?.url;
              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="block overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-[var(--brand-primary)] hover:shadow-md"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={album.title} className="h-32 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-neutral-100 text-xs text-neutral-400">
                      No photos yet
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-xs uppercase text-[var(--brand-primary)]">
                      {album.type.replaceAll("_", " ")}
                    </div>
                    <div className="font-medium text-neutral-900">{album.title}</div>
                    <div className="text-sm text-neutral-500">{album._count.media} items</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
