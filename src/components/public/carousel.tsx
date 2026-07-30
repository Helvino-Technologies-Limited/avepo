"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function Carousel({
  children,
  autoPlayMs = 3000,
}: {
  children: ReactNode;
  autoPlayMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  function scrollBy(amount: number) {
    const track = trackRef.current;
    if (!track) return;

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const atStart = track.scrollLeft <= 4;

    if (amount > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (amount < 0 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: amount, behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => scrollBy(300), autoPlayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, autoPlayMs]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
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
