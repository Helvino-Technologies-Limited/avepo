import { SITE_URL } from "@/lib/site";

type ArticleSchemaProps = {
  post: {
    slug: string;
    title: string;
    coverImage: string | null;
    publishAt: Date | null;
    updatedAt: Date;
    author: { name: string | null } | null;
  };
  description?: string;
};

export function ArticleSchema({ post, description }: ArticleSchemaProps) {
  const url = `${SITE_URL}/news/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: url,
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    ...(post.publishAt ? { datePublished: post.publishAt.toISOString() } : {}),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: post.author?.name || "Avepo Enterprises Limited",
    },
    publisher: {
      "@type": "Organization",
      name: "Avepo Enterprises Limited",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/avepo-logo.jpg` },
    },
  };

  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
