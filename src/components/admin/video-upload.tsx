"use client";

import { useState, useTransition } from "react";
import { uploadToBlob } from "@/lib/upload-client";
import { useRegisterUploadPending } from "@/components/upload-pending-context";

export function VideoUpload({
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
  useRegisterUploadPending(isPending);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    startTransition(async () => {
      const result = await uploadToBlob(file, {
        folder,
        kind: "video",
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
      <input
        type="text"
        placeholder="Paste a YouTube link (e.g. https://youtu.be/xxxxxxxxxxx) or an MP4 URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
      />
      <div className="mt-2 flex items-center gap-3">
        <span className="text-xs text-neutral-500">...or upload a video file:</span>
        <input type="file" accept="video/mp4,video/webm,video/ogg" onChange={handleChange} className="text-sm" />
      </div>
      {isPending && (
        <p className="text-xs text-neutral-500">
          Uploading{progress != null ? ` ${Math.round(progress)}%` : ""} (large videos can take a
          few minutes)...
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {url && (
        <button
          type="button"
          onClick={() => setUrl("")}
          className="mt-1 text-xs text-neutral-500 underline"
        >
          Remove video
        </button>
      )}
    </div>
  );
}
