"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

function step(track: HTMLDivElement, direction: 1 | -1) {
  const firstItem = track.firstElementChild as HTMLElement | null;
  const itemWidth = firstItem ? firstItem.offsetWidth + 16 /* gap-4 */ : 300;

  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const atStart = track.scrollLeft <= 4;

  if (direction > 0 && atEnd) {
    track.scrollTo({ left: 0, behavior: "smooth" });
  } else if (direction < 0 && atStart) {
    track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  } else {
    track.scrollBy({ left: direction * itemWidth, behavior: "smooth" });
  }
}

export function Carousel({
  children,
  autoPlayMs = 2800,
}: {
  children: ReactNode;
  autoPlayMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      if (trackRef.current) step(trackRef.current, 1);
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [isPaused, autoPlayMs]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => trackRef.current && step(trackRef.current, -1)}
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 text-neutral-700 shadow-md hover:bg-neutral-50 sm:block"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => trackRef.current && step(trackRef.current, 1)}
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
