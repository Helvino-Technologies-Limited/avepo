"use client";

import { useState, useTransition } from "react";
import { uploadToBlob } from "@/lib/upload-client";
import { useRegisterUploadPending } from "@/components/upload-pending-context";

export function PublicImageUpload({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  useRegisterUploadPending(isPending);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    startTransition(async () => {
      const result = await uploadToBlob(file, {
        folder: "submissions/images",
        kind: "image",
        isPublic: true,
        onProgress: setProgress,
      });
      setProgress(null);
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-14 w-14 rounded-md border border-neutral-200 object-cover" />
        )}
        <input type="file" accept="image/*,.jfif" onChange={handleChange} className="text-sm" />
      </div>
      {isPending && (
        <p className="text-xs text-neutral-500">
          Uploading{progress != null ? `... ${Math.round(progress)}%` : "..."}
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
