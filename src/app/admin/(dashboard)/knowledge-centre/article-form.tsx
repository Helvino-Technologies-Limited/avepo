import { Field, TextInput, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import type { KnowledgeArticle } from "@prisma/client";

const CATEGORY_LABELS: Record<string, string> = {
  CROP_PRODUCTION: "Crop Production",
  LIVESTOCK: "Livestock",
  POULTRY: "Poultry",
  SOIL_HEALTH: "Soil Health",
  FERTILIZERS: "Fertilizers",
  PEST_MANAGEMENT: "Pest Management",
  DISEASE_MANAGEMENT: "Disease Management",
  CLIMATE_SMART_AGRICULTURE: "Climate Smart Agriculture",
  AI_IN_FARMING: "AI in Farming",
};

export function ArticleForm({
  action,
  article,
}: {
  action: (formData: FormData) => Promise<void>;
  article?: KnowledgeArticle;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={article?.title} />
      </Field>

      <Field label="Category" htmlFor="category">
        <Select id="category" name="category" defaultValue={article?.category ?? "CROP_PRODUCTION"}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Body" htmlFor="body">
        <TextArea id="body" name="body" rows={8} defaultValue={article?.body ?? ""} />
      </Field>

      <ImageUpload
        name="coverImage"
        label="Cover Image"
        folder="knowledge-centre"
        defaultValue={article?.coverImage}
      />

      <FileUpload
        name="pdfUrl"
        label="PDF Download (optional)"
        folder="knowledge-centre"
        defaultValue={article?.pdfUrl}
      />

      <Field label="Video URL (optional)" htmlFor="videoUrl">
        <TextInput id="videoUrl" name="videoUrl" defaultValue={article?.videoUrl ?? ""} />
      </Field>

      <Checkbox name="isPublished" label="Published" defaultChecked={article?.isPublished ?? false} />

      <SubmitButton>{article ? "Save Changes" : "Create Article"}</SubmitButton>
    </form>
  );
}
