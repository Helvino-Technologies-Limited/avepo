import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { stripHtml } from "@/lib/html";
import { sanitizeHtml } from "@/lib/sanitize";
import { ArticleSchema } from "@/components/public/article-schema";
import { BreadcrumbSchema } from "@/components/public/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post) return {};

  const description = post.body ? stripHtml(post.body).slice(0, 160) : undefined;
  const url = `${SITE_URL}/news/${post.slug}`;
  const images = post.coverImage ? [post.coverImage] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <div>
      <ArticleSchema
        post={post}
        description={post.body ? stripHtml(post.body).slice(0, 160) : undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "News", url: `${SITE_URL}/news` },
          { name: post.title, url: `${SITE_URL}/news/${post.slug}` },
        ]}
      />
      <PageHeader
        title={post.title}
        subtitle={post.publishAt ? post.publishAt.toLocaleDateString() : undefined}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover" />
        )}
        {post.category && <div className="mt-4 text-xs uppercase text-[var(--brand-primary)]">{post.category}</div>}
        {post.body && (
          <div
            className="rich-content mt-4 text-neutral-800"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body) }}
          />
        )}

        {post.media.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {post.media.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-32 w-full rounded object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
