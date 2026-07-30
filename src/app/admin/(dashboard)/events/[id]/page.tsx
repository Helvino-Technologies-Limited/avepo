import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EventForm } from "../event-form";
import { updateEvent } from "../actions";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Event</h1>
      <div className="mt-6 max-w-2xl">
        <EventForm action={updateEvent.bind(null, id)} event={event} />
      </div>
    </div>
  );
}
