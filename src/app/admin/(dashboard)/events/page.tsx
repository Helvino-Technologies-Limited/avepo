import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { getEventStatus } from "@/lib/events";
import { deleteEvent, toggleEventActive } from "./actions";

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Event
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={events}
          emptyMessage="No events yet. Add your first event above."
          editHref={(e) => `/admin/events/${e.id}`}
          columns={[
            { header: "Title", render: (e) => e.title },
            { header: "Venue", render: (e) => e.venue ?? "—" },
            { header: "Status", render: (e) => getEventStatus(e) },
            { header: "Start", render: (e) => e.startDate.toLocaleString() },
            { header: "Active", render: (e) => (e.isActive ? "Yes" : "No") },
          ]}
          rowActions={(e) => (
            <>
              <ToggleButton isActive={e.isActive} action={toggleEventActive.bind(null, e.id, e.isActive)} />{" "}
              <DeleteButton action={deleteEvent.bind(null, e.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
