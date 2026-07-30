"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function ExpandableCard({
  summary,
  children,
}: {
  summary: ReactNode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div className="flex-1">{summary}</div>
        <span className="mt-1 text-neutral-400">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="mt-4 border-t border-neutral-100 pt-4">{children}</div>}
    </div>
  );
}
