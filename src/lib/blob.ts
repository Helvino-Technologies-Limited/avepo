"use server";

import { put, del } from "@vercel/blob";
import { auth } from "@/auth";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jfif",
  "image/pjpeg",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const FILE_TYPES = new Set(["application/pdf"]);
const MAX_FILE_BYTES = 15 * 1024 * 1024;

export type UploadResult = { url?: string; error?: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authorized to upload files.");
  }
}

function extFromName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }

  const isJfif = file.name.toLowerCase().endsWith(".jfif");
  if (!IMAGE_TYPES.has(file.type) && !isJfif) {
    return { error: "Unsupported image type. Use JPG, PNG, WEBP, GIF, or JFIF." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image is too large (max 5MB)." };
  }

  const folder = (formData.get("folder") as string) || "uploads";
  const blob = await put(`${folder}/${crypto.randomUUID()}${extFromName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }

  if (!FILE_TYPES.has(file.type)) {
    return { error: "Unsupported file type. Only PDF is allowed." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: "File is too large (max 15MB)." };
  }

  const folder = (formData.get("folder") as string) || "documents";
  const blob = await put(`${folder}/${crypto.randomUUID()}${extFromName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}

export async function deleteBlob(url: string): Promise<void> {
  await requireSession();
  try {
    await del(url);
  } catch {
    // Non-fatal: the DB record update/removal is what matters most.
  }
}
