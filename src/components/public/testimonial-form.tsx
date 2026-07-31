"use client";

import { useActionState } from "react";
import { submitTestimonial, type SubmitTestimonialState } from "@/app/admin/(dashboard)/testimonials/actions";

const initialState: SubmitTestimonialState = { success: false };

export function TestimonialSubmitForm() {
  const [state, formAction, isPending] = useActionState(submitTestimonial, initialState);

  if (state.success) {
    return (
      <p className="rounded-md border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10 p-3 text-sm text-[var(--brand-primary-dark)]">
        Thank you for sharing your experience — it will appear here once our team reviews it.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Your name"
          required
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
        <input
          name="role"
          placeholder="Farm / Location (optional)"
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>
      <select
        name="rating"
        defaultValue="5"
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
      >
        <option value="5">★★★★★ (5)</option>
        <option value="4">★★★★☆ (4)</option>
        <option value="3">★★★☆☆ (3)</option>
        <option value="2">★★☆☆☆ (2)</option>
        <option value="1">★☆☆☆☆ (1)</option>
      </select>
      <textarea
        name="quote"
        placeholder="Tell us about your experience with Avepo..."
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
        {isPending ? "Submitting..." : "Share Your Experience"}
      </button>
    </form>
  );
}
