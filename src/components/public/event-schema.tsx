import { SITE_URL } from "@/lib/site";

type EventSchemaProps = {
  event: {
    slug: string;
    title: string;
    description: string | null;
    venue: string | null;
    startDate: Date;
    endDate: Date;
    coverImage: string | null;
    organizer: string | null;
  };
};

export function EventSchema({ event }: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.description ? { description: event.description } : {}),
    url: `${SITE_URL}/events/${event.slug}`,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(event.coverImage ? { image: [event.coverImage] } : {}),
    location: {
      "@type": "Place",
      name: event.venue || "Avepo Agrovets Limited",
      address: { "@type": "PostalAddress", addressRegion: "Siaya County", addressCountry: "KE" },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer || "Avepo Agrovets Limited",
      url: SITE_URL,
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
