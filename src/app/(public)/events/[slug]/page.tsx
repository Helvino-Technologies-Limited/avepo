import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/public/page-header";
import { getEventStatus } from "@/lib/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return {};

  return {
    title: `${event.title} | Avepo Events`,
    description: event.description?.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      images: event.coverImage ? [event.coverImage] : undefined,
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  PAST: "Past",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.isActive) notFound();

  return (
    <div>
      <PageHeader title={event.title} subtitle={event.venue ?? undefined} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {event.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage} alt={event.title} className="w-full rounded-lg object-cover" />
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
            {STATUS_LABEL[getEventStatus(event)]}
          </span>
          <span>{event.startDate.toLocaleString()} — {event.endDate.toLocaleString()}</span>
          {event.organizer && <span>Organized by {event.organizer}</span>}
        </div>

        {event.description && <p className="mt-4 whitespace-pre-wrap text-neutral-800">{event.description}</p>}

        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            Register for this Event
          </a>
        )}

        {event.gallery.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {event.gallery.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-32 w-full rounded object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
