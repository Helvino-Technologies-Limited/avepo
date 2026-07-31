"use client";

import { useActionState } from "react";
import { submitReview, type SubmitReviewState } from "@/app/(public)/products/[slug]/actions";

const initialState: SubmitReviewState = { success: false };

export function ReviewForm({ productId }: { productId: string }) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  if (state.success) {
    return (
      <p className="rounded-md border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10 p-3 text-sm text-[var(--brand-primary-dark)]">
        Thanks for your review — it will appear once approved by our team.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="authorName"
          placeholder="Your name"
          required
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
        <select name="rating" required defaultValue="5" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900">
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>
      </div>
      <textarea
        name="comment"
        placeholder="Share your experience with this product..."
        required
        rows={3}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
