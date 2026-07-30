import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/public/page-header";
import { getEventStatus } from "@/lib/events";

const STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  PAST: "Past",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { startDate: "asc" },
  });

  // Homepage/main listing only shows Upcoming + Ongoing; Past events remain
  // searchable in the archive rather than cluttering the main list.
  const visibleEvents = events.filter((event) => getEventStatus(event) !== "PAST");

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Agricultural exhibitions, field days, and farmer training sessions."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {visibleEvents.length === 0 ? (
          <EmptyState message="No upcoming events right now. Check back soon or browse the archive." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {visibleEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="block rounded-lg border border-neutral-200 p-4 hover:border-green-300"
              >
                {event.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="mb-3 h-32 w-full rounded object-cover"
                  />
                )}
                <div className="text-xs uppercase text-green-700">
                  {STATUS_LABEL[getEventStatus(event)]}
                </div>
                <div className="font-medium text-neutral-900">{event.title}</div>
                <div className="mt-1 text-sm text-neutral-500">{event.venue}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
