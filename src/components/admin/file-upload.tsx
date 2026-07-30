"use client";

import { useState, useTransition } from "react";
import { uploadFile } from "@/lib/blob";

export function FileUpload({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      const result = await uploadFile(formData);
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
      <div className="mt-1 flex items-center gap-3">
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="text-sm text-green-700 underline">
            View current file
          </a>
        )}
        <input type="file" accept="application/pdf" onChange={handleChange} className="text-sm" />
      </div>
      {isPending && <p className="text-xs text-neutral-500">Uploading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
