"use client";

import { useTransition } from "react";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        startTransition(() => action());
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function ToggleButton({
  action,
  isActive,
}: {
  action: () => Promise<void>;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => action())}
      className="text-neutral-600 hover:underline disabled:opacity-50"
    >
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
