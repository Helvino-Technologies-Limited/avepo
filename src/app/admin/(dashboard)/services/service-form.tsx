import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Service } from "@prisma/client";

export function ServiceForm({
  action,
  service,
}: {
  action: (formData: FormData) => Promise<void>;
  service?: Service;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={service?.title} />
      </Field>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={service?.description ?? ""} />
      </Field>

      <Field label="Icon (emoji or label, optional)" htmlFor="icon">
        <TextInput id="icon" name="icon" defaultValue={service?.icon ?? ""} />
      </Field>

      <ImageUpload name="image" label="Image" folder="services" defaultValue={service?.image} />

      <div className="flex gap-6">
        <Checkbox
          name="isFeatured"
          label="Featured on homepage"
          defaultChecked={service?.isFeatured ?? false}
        />
        <Checkbox
          name="isActive"
          label="Active (visible on site)"
          defaultChecked={service?.isActive ?? true}
        />
      </div>

      <SubmitButton>{service ? "Save Changes" : "Create Service"}</SubmitButton>
    </form>
  );
}
