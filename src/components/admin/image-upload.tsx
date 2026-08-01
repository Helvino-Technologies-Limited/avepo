"use client";

import { useRef, useState, useTransition } from "react";
import { uploadToBlob } from "@/lib/upload-client";
import { useRegisterUploadPending } from "@/components/upload-pending-context";

export function ImageUpload({
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
  const [progress, setProgress] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  useRegisterUploadPending(isPending);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    startTransition(async () => {
      const result = await uploadToBlob(file, {
        folder,
        kind: "image",
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

      <div className="mt-1 flex items-center gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-16 w-16 rounded-md border border-neutral-200 object-cover"
          />
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.jfif"
            onChange={handleChange}
            className="text-sm"
          />
          {isPending && (
            <p className="text-xs text-neutral-500">
              Uploading{progress != null ? `... ${Math.round(progress)}%` : "..."}
            </p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-1 text-xs text-neutral-500 underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
