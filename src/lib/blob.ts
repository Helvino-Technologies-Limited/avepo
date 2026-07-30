"use server";

import { put, del } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

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

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/ogg"]);
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

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

const PUBLIC_UPLOAD_LIMIT_PER_HOUR = 10;

/**
 * Public submission forms (success stories, testimonials) let anonymous
 * visitors upload files, so unlike the admin uploads above this can't gate
 * on a session — instead it rate-limits per IP to deter abuse of the Blob
 * store, logged through the existing ActivityLog table.
 */
async function checkPublicUploadRateLimit(): Promise<string | null> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";

  const recentCount = await prisma.activityLog.count({
    where: {
      action: "PUBLIC_UPLOAD",
      metadata: { path: ["ip"], equals: ip },
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });

  if (recentCount >= PUBLIC_UPLOAD_LIMIT_PER_HOUR) {
    return null;
  }

  await prisma.activityLog.create({
    data: { action: "PUBLIC_UPLOAD", entityType: "Upload", metadata: { ip } },
  });

  return ip;
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

export async function uploadVideo(formData: FormData): Promise<UploadResult> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }

  if (!VIDEO_TYPES.has(file.type)) {
    return { error: "Unsupported video type. Use MP4, WEBM, or OGG." };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { error: "Video is too large (max 50MB)." };
  }

  const folder = (formData.get("folder") as string) || "videos";
  const blob = await put(`${folder}/${crypto.randomUUID()}${extFromName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}

export async function uploadPublicImage(formData: FormData): Promise<UploadResult> {
  const ip = await checkPublicUploadRateLimit();
  if (!ip) return { error: "Too many uploads from your network. Please try again later." };

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

  const blob = await put(`submissions/images/${crypto.randomUUID()}${extFromName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}

export async function uploadPublicVideo(formData: FormData): Promise<UploadResult> {
  const ip = await checkPublicUploadRateLimit();
  if (!ip) return { error: "Too many uploads from your network. Please try again later." };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }

  if (!VIDEO_TYPES.has(file.type)) {
    return { error: "Unsupported video type. Use MP4, WEBM, or OGG." };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { error: "Video is too large (max 50MB)." };
  }

  const blob = await put(`submissions/videos/${crypto.randomUUID()}${extFromName(file.name)}`, file, {
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
