"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "avepo.cookie-consent";

export type ConsentValue = "accepted" | "declined";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>("declined");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setHasMounted(true);
  }, []);

  function choose(value: ConsentValue) {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    // Let same-tab listeners (e.g. the analytics loader) react immediately.
    window.dispatchEvent(new Event("avepo-consent-changed"));
  }

  if (!hasMounted || consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral-200 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-700">
          We use cookies to improve your experience and understand site usage. By clicking
          &ldquo;Accept&rdquo;, you consent to our use of cookies.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-primary-dark)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
