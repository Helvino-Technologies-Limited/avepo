import { Field, TextInput, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Partner } from "@prisma/client";

export function PartnerForm({
  action,
  partner,
}: {
  action: (formData: FormData) => Promise<void>;
  partner?: Partner;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" required defaultValue={partner?.name} />
      </Field>

      <ImageUpload name="logo" label="Logo" folder="partners" defaultValue={partner?.logo} />

      <Field label="Website (optional)" htmlFor="website">
        <TextInput id="website" name="website" defaultValue={partner?.website ?? ""} />
      </Field>

      <Checkbox name="isActive" label="Active" defaultChecked={partner?.isActive ?? true} />

      <SubmitButton>{partner ? "Save Changes" : "Create Partner"}</SubmitButton>
    </form>
  );
}
