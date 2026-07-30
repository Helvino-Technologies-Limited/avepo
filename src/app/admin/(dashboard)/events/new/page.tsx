import { EventForm } from "../event-form";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Event</h1>
      <div className="mt-6 max-w-2xl">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
