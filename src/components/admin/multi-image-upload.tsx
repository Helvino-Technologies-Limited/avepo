"use client";

import { useState, useTransition } from "react";
import { uploadToBlob } from "@/lib/upload-client";
import { useRegisterUploadPending } from "@/components/upload-pending-context";

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
  useRegisterUploadPending(isPending);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);

    startTransition(async () => {
      const results = await Promise.all(
        files.map((file) => uploadToBlob(file, { folder, kind: "image" }))
      );

      const errors = results.filter((r) => r.error).map((r) => r.error!);
      if (errors.length > 0) setError(errors[0]);

      const newUrls = results.filter((r) => r.url).map((r) => r.url!);
      if (newUrls.length > 0) setUrls((prev) => [...prev, ...newUrls]);
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

      <input
        type="file"
        accept="image/*,.jfif"
        multiple
        onChange={handleChange}
        className="mt-2 text-sm"
      />
      {isPending && <p className="text-xs text-neutral-500">Uploading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
