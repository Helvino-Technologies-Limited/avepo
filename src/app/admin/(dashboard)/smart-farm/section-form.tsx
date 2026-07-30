import { Field, TextInput, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import type { SmartFarmSection } from "@prisma/client";

export function SectionForm({
  action,
  section,
}: {
  action: (formData: FormData) => Promise<void>;
  section?: SmartFarmSection;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={section?.title} />
      </Field>

      <Field label="Type" htmlFor="type">
        <Select id="type" name="type" defaultValue={section?.type ?? "DEMO_FARM"}>
          <option value="DEMO_FARM">Demonstration Farm</option>
          <option value="GREENHOUSE">Greenhouse</option>
          <option value="DAIRY">Dairy Unit</option>
          <option value="POULTRY">Poultry</option>
        </Select>
      </Field>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={section?.description ?? ""} />
      </Field>

      <MultiImageUpload
        name="images"
        label="Images"
        folder="smart-farm"
        defaultValue={section?.images}
      />

      <Field label="Video URLs (comma-separated, optional)" htmlFor="videos">
        <TextInput id="videos" name="videos" defaultValue={section?.videos.join(", ") ?? ""} />
      </Field>

      <Checkbox name="isActive" label="Active" defaultChecked={section?.isActive ?? true} />

      <SubmitButton>{section ? "Save Changes" : "Create Section"}</SubmitButton>
    </form>
  );
}
