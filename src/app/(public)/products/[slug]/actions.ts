"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const schema = z.object({
  productId: z.string(),
  authorName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export type SubmitReviewState = { success: boolean; error?: string };

export async function submitReview(
  _prev: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const parsed = schema.safeParse({
    productId: formData.get("productId"),
    authorName: formData.get("authorName"),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, error: "Please fill in your name, a rating, and a comment." };
  }

  await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      isApproved: false,
    },
  });

  revalidatePath(`/products`);
  return { success: true };
}
