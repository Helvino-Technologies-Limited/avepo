"use client";

import { useState } from "react";
import { Field, TextInput, Select, SubmitButton } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { VideoUpload } from "@/components/admin/video-upload";

export function AddMediaForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [type, setType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [videoSource, setVideoSource] = useState<"upload" | "link">("upload");

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
          <option value="VIDEO">Video</option>
        </Select>
      </Field>

      {type === "IMAGE" ? (
        <MultiImageUpload name="urls" label="Images" folder="gallery" />
      ) : (
        <>
          <Field label="Video Source" htmlFor="videoSource">
            <Select
              id="videoSource"
              value={videoSource}
              onChange={(e) => setVideoSource(e.target.value as "upload" | "link")}
            >
              <option value="upload">Upload video file (MP4/WEBM/OGG)</option>
              <option value="link">YouTube / Vimeo link</option>
            </Select>
          </Field>
          {videoSource === "upload" ? (
            <VideoUpload name="url" label="Video File" folder="gallery" />
          ) : (
            <Field label="Video URL" htmlFor="url">
              <TextInput id="url" name="url" placeholder="https://youtube.com/watch?v=..." required />
            </Field>
          )}
        </>
      )}

      <Field label="Caption (optional, applied to all)" htmlFor="caption">
        <TextInput id="caption" name="caption" />
      </Field>

      <SubmitButton>Add to Album</SubmitButton>
    </form>
  );
}
