import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { toDatetimeLocalValue } from "@/lib/date";
import type { Event } from "@prisma/client";

export function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => Promise<void>;
  event?: Event;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={event?.title} />
      </Field>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={event?.description ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Venue" htmlFor="venue">
          <TextInput id="venue" name="venue" defaultValue={event?.venue ?? ""} />
        </Field>
        <Field label="Organizer" htmlFor="organizer">
          <TextInput id="organizer" name="organizer" defaultValue={event?.organizer ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start Date & Time" htmlFor="startDate">
          <TextInput
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocalValue(event?.startDate)}
          />
        </Field>
        <Field label="End Date & Time" htmlFor="endDate">
          <TextInput
            id="endDate"
            name="endDate"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocalValue(event?.endDate)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <TextInput id="category" name="category" defaultValue={event?.category ?? ""} />
        </Field>
        <Field label="Registration Link" htmlFor="registrationLink">
          <TextInput
            id="registrationLink"
            name="registrationLink"
            defaultValue={event?.registrationLink ?? ""}
          />
        </Field>
      </div>

      <Field label="Video URL (YouTube/Vimeo, optional)" htmlFor="videoUrl">
        <TextInput id="videoUrl" name="videoUrl" defaultValue={event?.videoUrl ?? ""} />
      </Field>

      <ImageUpload
        name="coverImage"
        label="Cover Image"
        folder="events"
        defaultValue={event?.coverImage}
      />

      <MultiImageUpload name="gallery" label="Gallery" folder="events" defaultValue={event?.gallery} />

      <Checkbox name="isActive" label="Active (visible on site)" defaultChecked={event?.isActive ?? true} />

      <SubmitButton>{event ? "Save Changes" : "Create Event"}</SubmitButton>
    </form>
  );
}
