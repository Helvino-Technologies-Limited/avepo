"use client";

import { useEffect, useRef, useState } from "react";

type Counts = { unreadMessages: number; pendingOrders: number; pendingReviews: number };

const POLL_MS = 25000;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

export function VoiceAlerts() {
  const [enabled, setEnabled] = useState(false);
  const [armed, setArmed] = useState(false);
  const previous = useRef<Counts | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/admin/alerts-check", { cache: "no-store" });
        if (!res.ok) return;
        const counts: Counts = await res.json();
        if (cancelled) return;

        if (previous.current) {
          const announcements: string[] = [];
          if (counts.pendingOrders > previous.current.pendingOrders) {
            const diff = counts.pendingOrders - previous.current.pendingOrders;
            announcements.push(`${diff} new order${diff > 1 ? "s" : ""} received`);
          }
          if (counts.unreadMessages > previous.current.unreadMessages) {
            const diff = counts.unreadMessages - previous.current.unreadMessages;
            announcements.push(`${diff} new message${diff > 1 ? "s" : ""}`);
          }
          if (counts.pendingReviews > previous.current.pendingReviews) {
            const diff = counts.pendingReviews - previous.current.pendingReviews;
            announcements.push(`${diff} new review${diff > 1 ? "s" : ""} to approve`);
          }
          if (announcements.length > 0) {
            speak(`Avepo Admin alert: ${announcements.join(", ")}.`);
          }
        }

        previous.current = counts;
      } catch {
        // Network hiccup — just try again on the next poll.
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled]);

  function handleEnable() {
    setEnabled(true);
    setArmed(true);
    speak("Voice alerts enabled.");
  }

  if (armed) {
    return (
      <button
        type="button"
        onClick={() => {
          setEnabled(false);
          setArmed(false);
          window.speechSynthesis?.cancel();
        }}
        className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
        title="Turn off spoken alerts for new orders, messages, and reviews"
      >
        🔊 Voice Alerts On
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleEnable}
      className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
      title="Get a spoken announcement when new orders, messages, or reviews come in"
    >
      🔇 Enable Voice Alerts
    </button>
  );
}
