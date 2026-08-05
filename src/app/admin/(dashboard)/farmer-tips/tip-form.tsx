import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { VideoUpload } from "@/components/admin/video-upload";
import type { FarmerTip } from "@prisma/client";
import { UploadPendingProvider } from "@/components/upload-pending-context";

const CATEGORY_SUGGESTIONS = [
  "Disease Control",
  "Pest Control",
  "Seed Selection",
  "Soil & Fertility",
  "Irrigation & Water",
  "Livestock Health",
  "General",
];

export function TipForm({
  action,
  tip,
}: {
  action: (formData: FormData) => Promise<void>;
  tip?: FarmerTip;
}) {
  return (
    <UploadPendingProvider>
      <form action={action} className="space-y-4">
        <Field label="Title" htmlFor="title">
          <TextInput id="title" name="title" required defaultValue={tip?.title} />
        </Field>

        <Field label="Category" htmlFor="category">
          <TextInput
            id="category"
            name="category"
            list="tip-category-suggestions"
            placeholder="e.g. Pest Control"
            defaultValue={tip?.category ?? ""}
          />
          <datalist id="tip-category-suggestions">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="Tip Content" htmlFor="body">
          <TextArea id="body" name="body" required rows={8} defaultValue={tip?.body ?? ""} />
        </Field>

        <MultiImageUpload name="images" label="Photos" folder="farmer-tips" defaultValue={tip?.images} />

        <VideoUpload name="videoUrl" label="Video (optional)" folder="farmer-tips" defaultValue={tip?.videoUrl} />

        <div className="flex flex-wrap gap-6">
          <Checkbox name="isFeatured" label="Featured (highlighted on the tips page)" defaultChecked={tip?.isFeatured ?? false} />
          <Checkbox name="isActive" label="Active (visible on site)" defaultChecked={tip?.isActive ?? true} />
        </div>

        <SubmitButton>{tip ? "Save Changes" : "Publish Tip"}</SubmitButton>
      </form>
    </UploadPendingProvider>
  );
}
