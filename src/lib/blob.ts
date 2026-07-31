"use server";

import { del } from "@vercel/blob";
import { requireSession } from "@/lib/upload-server";

export async function deleteBlob(url: string): Promise<void> {
  await requireSession();
  try {
    await del(url);
  } catch {
    // Non-fatal: the DB record update/removal is what matters most.
  }
}
