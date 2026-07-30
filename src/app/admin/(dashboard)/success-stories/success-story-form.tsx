import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import type { SuccessStory } from "@prisma/client";

export function SuccessStoryForm({
  action,
  story,
}: {
  action: (formData: FormData) => Promise<void>;
  story?: SuccessStory;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <TextInput id="title" name="title" required defaultValue={story?.title} />
        </Field>
        <Field label="Farmer Name" htmlFor="farmerName">
          <TextInput id="farmerName" name="farmerName" required defaultValue={story?.farmerName} />
        </Field>
      </div>

      <Field label="Story" htmlFor="body">
        <TextArea id="body" name="body" defaultValue={story?.body ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUpload
          name="beforeImage"
          label="Before Image"
          folder="success-stories"
          defaultValue={story?.beforeImage}
        />
        <ImageUpload
          name="afterImage"
          label="After Image"
          folder="success-stories"
          defaultValue={story?.afterImage}
        />
      </div>

      <Field label="Video URL (optional)" htmlFor="video">
        <TextInput id="video" name="video" defaultValue={story?.video ?? ""} />
      </Field>

      <Checkbox name="isActive" label="Active" defaultChecked={story?.isActive ?? true} />

      <SubmitButton>{story ? "Save Changes" : "Create Success Story"}</SubmitButton>
    </form>
  );
}
