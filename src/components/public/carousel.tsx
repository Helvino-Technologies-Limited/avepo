"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

export function Carousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-320)}
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 text-neutral-700 shadow-md hover:bg-neutral-50 sm:block"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(320)}
        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 text-neutral-700 shadow-md hover:bg-neutral-50 sm:block"
      >
        ›
      </button>
    </div>
  );
}

export function CarouselItem({ children }: { children: ReactNode }) {
  return <div className="w-64 shrink-0 snap-start">{children}</div>;
}
