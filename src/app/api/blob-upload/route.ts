import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireSession, checkPublicUploadRateLimit, maxBytesFor, type UploadKind } from "@/lib/upload-server";

const ALLOWED_CONTENT_TYPES: Record<UploadKind, string[]> = {
  // Vercel's own MIME allowlist is a light UX check, not the security
  // boundary (that's the auth/rate-limit checks below). "application/
  // octet-stream" is included everywhere as a fallback for files whose type
  // the browser itself can't determine (some file managers, oddball
  // extensions like .jfif) — the client already sends the real File.type
  // when it has one, so this only kicks in for genuinely ambiguous files.
  image: ["image/*", "application/octet-stream"],
  video: ["video/mp4", "video/webm", "video/ogg", "application/octet-stream"],
  file: ["application/pdf", "application/octet-stream"],
};

/**
 * Issues short-lived client upload tokens so the browser can PUT files
 * directly to Vercel Blob storage instead of routing the file body through
 * a Server Action/Route Handler — Vercel's serverless functions enforce a
 * hard 4.5MB request body limit that no Next.js config can raise, which is
 * why videos and larger photos used to fail silently above that size.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayloadRaw) => {
        let kind: UploadKind = "image";
        let isPublic = false;
        try {
          const payload = clientPayloadRaw ? JSON.parse(clientPayloadRaw) : {};
          if (payload.kind === "video" || payload.kind === "file" || payload.kind === "image") {
            kind = payload.kind;
          }
          isPublic = payload.isPublic === true;
        } catch {
          throw new Error("Invalid upload request.");
        }

        if (isPublic) {
          if (!pathname.startsWith("submissions/")) {
            throw new Error("Invalid upload destination.");
          }
          const ip = await checkPublicUploadRateLimit();
          if (!ip) throw new Error("Too many uploads from your network. Please try again later.");
        } else {
          if (pathname.includes("..")) {
            throw new Error("Invalid upload destination.");
          }
          await requireSession();
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES[kind],
          maximumSizeInBytes: maxBytesFor(kind, isPublic),
          addRandomSuffix: true,
          allowOverwrite: false,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
