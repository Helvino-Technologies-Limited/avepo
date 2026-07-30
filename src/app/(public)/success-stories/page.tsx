import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";

export default async function SuccessStoriesPage() {
  const stories = await prisma.successStory.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Farmer Success Stories"
        subtitle="Real before-and-after results from farmers we've worked with across Siaya County."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {stories.length === 0 ? (
          <EmptyState message="No success stories published yet. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {stories.map((story) => (
              <div key={story.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                {(story.beforeImage || story.afterImage) && (
                  <div className="grid grid-cols-2">
                    {story.beforeImage && (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={story.beforeImage} alt="Before" className="h-40 w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                          Before
                        </span>
                      </div>
                    )}
                    {story.afterImage && (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={story.afterImage} alt="After" className="h-40 w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                          After
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="font-medium text-neutral-900">{story.title}</div>
                  <div className="text-sm text-[var(--brand-primary)]">{story.farmerName}</div>
                  {story.body && <p className="mt-2 text-sm text-neutral-600">{story.body}</p>}
                  {story.video && (
                    <a
                      href={story.video}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-[var(--brand-primary)] underline"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
