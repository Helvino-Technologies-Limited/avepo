"use client";

import { upload } from "@vercel/blob/client";
import { maxBytesFor, formatMB } from "@/lib/upload-limits";

export type UploadResult = { url?: string; error?: string };

function extFromName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

// A silently-slow or stalled connection previously left the UI stuck showing
// "Uploading..." forever with no way out — bound every upload with a timeout
// so it always resolves to a clear error instead of hanging indefinitely.
const TIMEOUT_MS: Record<"image" | "video" | "file", number> = {
  image: 2 * 60 * 1000,
  file: 2 * 60 * 1000,
  video: 6 * 60 * 1000,
};

/**
 * Uploads directly from the browser to Vercel Blob storage via a short-lived
 * token from /api/blob-upload, instead of routing the file body through a
 * Server Action — see that route for why (4.5MB serverless payload limit).
 */
export async function uploadToBlob(
  file: File,
  options: {
    folder: string;
    kind: "image" | "video" | "file";
    isPublic?: boolean;
    onProgress?: (percentage: number) => void;
  }
): Promise<UploadResult> {
  const maxBytes = maxBytesFor(options.kind, options.isPublic ?? false);
  if (file.size > maxBytes) {
    return { error: `File is too large (max ${formatMB(maxBytes)}).` };
  }

  const pathname = `${options.folder}/${crypto.randomUUID()}${extFromName(file.name)}`;

  try {
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/blob-upload",
      clientPayload: JSON.stringify({ kind: options.kind, isPublic: options.isPublic ?? false }),
      // Without this, Vercel Blob infers contentType from the pathname's
      // extension — its lookup table doesn't know oddball extensions like
      // .jfif, so it silently fell back to "application/octet-stream" and
      // then rejected the upload against our allowedContentTypes. Trusting
      // the browser's own File.type (accurate for the vast majority of
      // real files) sidesteps that entirely.
      contentType: file.type || "application/octet-stream",
      // Splits large files into parts uploaded in parallel with automatic
      // retries per part — much more reliable than one giant request for
      // videos in particular, and doesn't hurt small files.
      multipart: true,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS[options.kind]),
      onUploadProgress: options.onProgress
        ? ({ percentage }) => options.onProgress!(percentage)
        : undefined,
    });
    return { url: blob.url };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { error: "Upload timed out. Check your connection and try again." };
    }
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }
}
