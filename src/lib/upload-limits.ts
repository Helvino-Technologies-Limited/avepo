export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_PUBLIC_VIDEO_BYTES = 50 * 1024 * 1024;

export type UploadKind = "image" | "video" | "file";

export function maxBytesFor(kind: UploadKind, isPublic: boolean) {
  if (kind === "video") return isPublic ? MAX_PUBLIC_VIDEO_BYTES : MAX_VIDEO_BYTES;
  if (kind === "file") return MAX_FILE_BYTES;
  return MAX_IMAGE_BYTES;
}

export function formatMB(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}
