"use client";

import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";

type UploadPendingContextValue = {
  anyPending: boolean;
  setPending: (id: string, pending: boolean) => void;
};

const UploadPendingContext = createContext<UploadPendingContextValue | null>(null);

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

  return (
    <UploadPendingContext.Provider value={{ anyPending, setPending }}>
      {children}
    </UploadPendingContext.Provider>
  );
}

export function useRegisterUploadPending(isPending: boolean) {
  const ctx = useContext(UploadPendingContext);
  const id = useId();

  useEffect(() => {
    if (!ctx) return;
    ctx.setPending(id, isPending);
    return () => ctx.setPending(id, false);
  }, [ctx, id, isPending]);
}

export function useAnyUploadPending(): boolean {
  return useContext(UploadPendingContext)?.anyPending ?? false;
}
