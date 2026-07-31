import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export { type UploadKind, maxBytesFor } from "@/lib/upload-limits";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authorized to upload files.");
  }
}

const PUBLIC_UPLOAD_LIMIT_PER_HOUR = 10;

/**
 * Public submission forms (success stories, testimonials) let anonymous
 * visitors upload files, so unlike admin uploads this can't gate on a
 * session — instead it rate-limits per IP to deter abuse of the Blob store,
 * logged through the existing ActivityLog table.
 */
export async function checkPublicUploadRateLimit(): Promise<string | null> {
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
