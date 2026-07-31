"use client";

import { upload } from "@vercel/blob/client";
import { maxBytesFor, formatMB } from "@/lib/upload-limits";

export type UploadResult = { url?: string; error?: string };

function extFromName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

/**
 * Uploads directly from the browser to Vercel Blob storage via a short-lived
 * token from /api/blob-upload, instead of routing the file body through a
 * Server Action — see that route for why (4.5MB serverless payload limit).
 */
export async function uploadToBlob(
  file: File,
  options: { folder: string; kind: "image" | "video" | "file"; isPublic?: boolean }
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
    });
    return { url: blob.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }
}
