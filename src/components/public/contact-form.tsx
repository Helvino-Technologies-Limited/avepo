"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactForm, type ContactFormState } from "@/app/(public)/contact/actions";

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const searchParams = useSearchParams();
  const serviceInterest = searchParams.get("service");

  if (state.success) {
    return (
      <div className="rounded-lg border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10 p-4 text-sm text-[var(--brand-primary-dark)]">
        Thank you — your message has been received. We&apos;ll get back to you shortly.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            defaultValue={serviceInterest ? `Enquiry: ${serviceInterest}` : ""}
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={
            serviceInterest
              ? `Hi, I'd like to enquire about your "${serviceInterest}" service. Please contact me with more details.`
              : ""
          }
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
