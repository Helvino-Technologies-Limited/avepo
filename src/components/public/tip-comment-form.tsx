"use client";

import { useActionState } from "react";
import { submitTipComment, type SubmitTipCommentState } from "@/app/(public)/farmer-tips/[slug]/actions";

const initialState: SubmitTipCommentState = { success: false };

export function TipCommentForm({ tipId }: { tipId: string }) {
  const [state, formAction, isPending] = useActionState(submitTipComment, initialState);

  if (state.success) {
    return (
      <p className="rounded-md border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10 p-3 text-sm text-[var(--brand-primary-dark)]">
        Thanks for your feedback — it will appear once approved by our team.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="tipId" value={tipId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="authorName"
          placeholder="Your name"
          required
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
        <select
          name="rating"
          defaultValue=""
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        >
          <option value="">Rate this tip (optional)</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>
      </div>
      <textarea
        name="comment"
        placeholder="Ask a question or share your experience with this tip..."
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
        {isPending ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
}
