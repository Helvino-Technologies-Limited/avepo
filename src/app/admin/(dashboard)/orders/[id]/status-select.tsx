"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "CONTACTED", "CONFIRMED", "FULFILLED", "CANCELLED"];

export function StatusSelect({
  status,
  action,
}: {
  status: OrderStatus;
  action: (status: OrderStatus) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => action(e.target.value as OrderStatus))}
      className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
