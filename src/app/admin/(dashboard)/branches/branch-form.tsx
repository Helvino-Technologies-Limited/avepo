import { Field, TextInput, Checkbox, SubmitButton } from "@/components/admin/ui";
import type { Branch } from "@prisma/client";

export function BranchForm({
  action,
  branch,
}: {
  action: (formData: FormData) => Promise<void>;
  branch?: Branch;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" required defaultValue={branch?.name} />
      </Field>

      <Field label="Address" htmlFor="address">
        <TextInput id="address" name="address" defaultValue={branch?.address ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone">
          <TextInput id="phone" name="phone" defaultValue={branch?.phone ?? ""} />
        </Field>
        <Field label="WhatsApp" htmlFor="whatsapp">
          <TextInput id="whatsapp" name="whatsapp" defaultValue={branch?.whatsapp ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" defaultValue={branch?.email ?? ""} />
        </Field>
        <Field label="Opening Hours" htmlFor="hours">
          <TextInput id="hours" name="hours" placeholder="Mon-Sat 8am-6pm" defaultValue={branch?.hours ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude (for Google Maps, optional)" htmlFor="lat">
          <TextInput id="lat" name="lat" type="number" step="any" defaultValue={branch?.lat ?? ""} />
        </Field>
        <Field label="Longitude (for Google Maps, optional)" htmlFor="lng">
          <TextInput id="lng" name="lng" type="number" step="any" defaultValue={branch?.lng ?? ""} />
        </Field>
      </div>

      <Checkbox name="isActive" label="Active (visible on site)" defaultChecked={branch?.isActive ?? true} />

      <SubmitButton>{branch ? "Save Changes" : "Create Branch"}</SubmitButton>
    </form>
  );
}
