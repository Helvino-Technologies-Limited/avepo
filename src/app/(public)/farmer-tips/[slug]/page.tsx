import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { TipCommentForm } from "@/components/public/tip-comment-form";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tip = await prisma.farmerTip.findUnique({ where: { slug } });
  if (!tip) return {};

  const description = tip.body.slice(0, 160);
  const url = `${SITE_URL}/farmer-tips/${tip.slug}`;
  const images = tip.images[0] ? [tip.images[0]] : undefined;

  return {
    title: tip.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: tip.title, description, url, type: "article", images },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: tip.title,
      description,
      images,
    },
  };
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function TipVideo({ videoUrl }: { videoUrl: string }) {
  const youtubeId = extractYouTubeId(videoUrl);

  if (youtubeId) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Tip video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video controls className="w-full rounded-lg">
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}

export default async function FarmerTipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = await prisma.farmerTip.findUnique({ where: { slug } });
  if (!tip || !tip.isActive) notFound();

  const comments = await prisma.tipComment.findMany({
    where: { tipId: tip.id, isApproved: true },
    orderBy: { createdAt: "desc" },
  });

  const rated = comments.filter((c) => c.rating != null);
  const avgRating =
    rated.length > 0 ? rated.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rated.length : null;

  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Farmer Tips", url: `${SITE_URL}/farmer-tips` },
          { name: tip.title, url: `${SITE_URL}/farmer-tips/${tip.slug}` },
        ]}
      />
      <PageHeader title={tip.title} subtitle={tip.category ?? undefined} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {tip.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tip.images[0]} alt={tip.title} className="w-full rounded-lg object-cover" />
        )}

        {avgRating && (
          <div className="mt-3 text-sm text-neutral-600">
            {"★".repeat(Math.round(avgRating))}
            {"☆".repeat(5 - Math.round(avgRating))} ({rated.length} rating
            {rated.length === 1 ? "" : "s"})
          </div>
        )}

        <p className="mt-4 whitespace-pre-wrap text-neutral-800">{tip.body}</p>

        {tip.images.length > 1 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tip.images.slice(1).map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-32 w-full rounded object-cover" />
            ))}
          </div>
        )}

        {tip.videoUrl && (
          <div className="mt-6">
            <TipVideo videoUrl={tip.videoUrl} />
          </div>
        )}

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-900">Comments & Reviews</h2>

          {comments.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">
              No comments yet. Be the first to share your thoughts on this tip.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-neutral-200 p-4">
                  <div className="text-sm font-medium text-neutral-900">{comment.authorName}</div>
                  {comment.rating && (
                    <div className="text-xs text-neutral-500">
                      {"★".repeat(comment.rating)}
                      {"☆".repeat(5 - comment.rating)}
                    </div>
                  )}
                  <p className="mt-1 text-sm text-neutral-700">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 max-w-lg">
            <h3 className="text-sm font-semibold text-neutral-900">Leave a Comment</h3>
            <p className="text-xs text-neutral-500">
              Comments are checked by our team before appearing publicly.
            </p>
            <div className="mt-3">
              <TipCommentForm tipId={tip.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
