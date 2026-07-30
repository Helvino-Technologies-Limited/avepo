"use client";

import { useActionState } from "react";
import {
  submitSuccessStory,
  type SubmitSuccessStoryState,
} from "@/app/admin/(dashboard)/success-stories/actions";
import { PublicImageUpload } from "@/components/public/public-image-upload";
import { PublicVideoUpload } from "@/components/public/public-video-upload";

const initialState: SubmitSuccessStoryState = { success: false };

export function SuccessStorySubmitForm() {
  const [state, formAction, isPending] = useActionState(submitSuccessStory, initialState);

  if (state.success) {
    return (
      <p className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Thank you for sharing your story — it will appear here once our team reviews it.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          placeholder="Story title (e.g. 'From struggling to thriving')"
          required
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
        <input
          name="farmerName"
          placeholder="Your name"
          required
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>
      <textarea
        name="body"
        placeholder="Tell us your story..."
        rows={4}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PublicImageUpload name="beforeImage" label="Before Photo (optional)" />
        <PublicImageUpload name="afterImage" label="After Photo (optional)" />
      </div>
      <PublicVideoUpload name="video" label="Video (optional)" />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Share Your Story"}
      </button>
    </form>
  );
}
