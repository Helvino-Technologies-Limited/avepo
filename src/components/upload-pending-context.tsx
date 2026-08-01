"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

type UploadPendingContextValue = {
  anyPending: boolean;
  setPending: (id: string, pending: boolean) => void;
};

const UploadPendingContext = createContext<UploadPendingContextValue | null>(null);

// If a pending flag ever fails to clear (e.g. a browser/extension quirk
// swallowing an event), this hard ceiling still unblocks the Save button
// rather than leaving an admin permanently unable to post.
const MAX_PENDING_MS = 3 * 60 * 1000;

/**
 * Wraps a form so upload widgets (ImageUpload, VideoUpload, etc.) can report
 * "still uploading" up to the form's submit button — without this, clicking
 * Save while a file was mid-upload would silently submit without it, since
 * the hidden input for that field hadn't been set yet.
 */
export function UploadPendingProvider({ children }: { children: React.ReactNode }) {
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});

  const setPending = useCallback((id: string, pending: boolean) => {
    setPendingIds((prev) => {
      if (Boolean(prev[id]) === pending) return prev;
      const next = { ...prev, [id]: pending };
      if (!pending) delete next[id];
      return next;
    });
  }, []);

  const anyPending = Object.keys(pendingIds).length > 0;

  // Stable across renders unless the aggregate flag actually flips, so
  // consumers' effects only re-run for their own state changes — not every
  // time any sibling upload widget's pending state changes.
  const value = useMemo(() => ({ anyPending, setPending }), [anyPending, setPending]);

  return <UploadPendingContext.Provider value={value}>{children}</UploadPendingContext.Provider>;
}

export function useRegisterUploadPending(isPending: boolean) {
  const ctx = useContext(UploadPendingContext);
  const id = useId();

  useEffect(() => {
    ctx?.setPending(id, isPending);
    if (!isPending) return;

    const failsafe = setTimeout(() => ctx?.setPending(id, false), MAX_PENDING_MS);
    return () => {
      clearTimeout(failsafe);
      ctx?.setPending(id, false);
    };
    // ctx is stable unless the aggregate anyPending flag flips (see the
    // provider's useMemo above), so depending on it here is safe and
    // doesn't cause cross-widget churn.
  }, [ctx, id, isPending]);
}

export function useAnyUploadPending(): boolean {
  return useContext(UploadPendingContext)?.anyPending ?? false;
}
