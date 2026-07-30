"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type SubscribeState } from "@/app/(public)/newsletter-actions";

const initialState: SubscribeState = { success: false };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  if (state.success) {
    return <p className="text-sm text-green-300">Thanks for subscribing!</p>;
  }

  return (
    <form action={formAction} className="flex gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
      >
        {isPending ? "..." : "Subscribe"}
      </button>
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
    </form>
  );
}
