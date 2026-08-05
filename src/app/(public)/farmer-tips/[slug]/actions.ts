"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const schema = z.object({
  tipId: z.string(),
  authorName: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1),
});

export type SubmitTipCommentState = { success: boolean; error?: string };

export async function submitTipComment(
  _prev: SubmitTipCommentState,
  formData: FormData
): Promise<SubmitTipCommentState> {
  const rawRating = formData.get("rating");
  const parsed = schema.safeParse({
    tipId: formData.get("tipId"),
    authorName: formData.get("authorName"),
    rating: rawRating ? Number(rawRating) : undefined,
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, error: "Please fill in your name and a comment." };
  }

  await prisma.tipComment.create({
    data: {
      tipId: parsed.data.tipId,
      authorName: parsed.data.authorName,
      rating: parsed.data.rating ?? null,
      comment: parsed.data.comment,
      isApproved: false,
    },
  });

  revalidatePath(`/farmer-tips`);
  return { success: true };
}
