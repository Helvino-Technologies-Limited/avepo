import { Field, TextInput, Checkbox, SubmitButton } from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/file-upload";
import { createDownload } from "../actions";

export default function NewDownloadPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Download</h1>
      <div className="mt-6 max-w-2xl">
        <form action={createDownload} className="space-y-4">
          <Field label="Title" htmlFor="title">
            <TextInput id="title" name="title" required />
          </Field>
          <Field label="Category (optional)" htmlFor="category">
            <TextInput
              id="category"
              name="category"
              placeholder="e.g. Price List, Catalogue, Application Form"
            />
          </Field>
          <FileUpload name="fileUrl" label="PDF File" folder="downloads" />
          <input type="hidden" name="fileType" value="PDF" />
          <Checkbox name="isActive" label="Active" defaultChecked />
          <SubmitButton>Create Download</SubmitButton>
        </form>
      </div>
    </div>
  );
}
