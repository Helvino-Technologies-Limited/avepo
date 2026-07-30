"use client";

import { useState, useTransition } from "react";
import { uploadImage } from "@/lib/blob";

export function MultiImageUpload({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
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
      const result = await uploadImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) setUrls((prev) => [...prev, result.url!]);
    });

    e.target.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      <div className="mt-1 flex flex-wrap items-center gap-3">
        {urls.map((url) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-16 w-16 rounded-md border border-neutral-200 object-cover"
            />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((u) => u !== url))}
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-600 text-xs text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input type="file" accept="image/*,.jfif" onChange={handleChange} className="mt-2 text-sm" />
      {isPending && <p className="text-xs text-neutral-500">Uploading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
