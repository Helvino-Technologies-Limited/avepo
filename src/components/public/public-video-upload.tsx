"use client";

import { useState, useTransition } from "react";
import { uploadPublicVideo } from "@/lib/blob";

export function PublicVideoUpload({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadPublicVideo(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) setUrl(result.url);
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleChange}
        className="mt-1 text-sm"
      />
      {isPending && <p className="text-xs text-neutral-500">Uploading (this may take a moment)...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {url && <p className="mt-1 text-xs text-[var(--brand-primary-dark)]">Video uploaded ✓</p>}
    </div>
  );
}
