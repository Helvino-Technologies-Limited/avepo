"use client";

import { useState } from "react";
import { Field, TextInput, Select, SubmitButton } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

export function AddMediaForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [type, setType] = useState<"IMAGE" | "VIDEO">("IMAGE");

  return (
    <form action={action} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
      <Field label="Media Type" htmlFor="type">
        <Select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "IMAGE" | "VIDEO")}
        >
          <option value="IMAGE">Image(s) — select multiple for bulk upload</option>
          <option value="VIDEO">Video (YouTube/Vimeo/MP4 link)</option>
        </Select>
      </Field>

      {type === "IMAGE" ? (
        <MultiImageUpload name="urls" label="Images" folder="gallery" />
      ) : (
        <Field label="Video URL" htmlFor="url">
          <TextInput id="url" name="url" placeholder="https://youtube.com/watch?v=..." required />
        </Field>
      )}

      <Field label="Caption (optional, applied to all)" htmlFor="caption">
        <TextInput id="caption" name="caption" />
      </Field>

      <SubmitButton>Add to Album</SubmitButton>
    </form>
  );
}
