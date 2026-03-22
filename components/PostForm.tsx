"use client";

import { CSSProperties, useRef, useState, useTransition } from "react";
import confetti from "canvas-confetti";
import { submitBuildLog } from "@/app/actions";
import { ShimmerButton } from "./ShimmerButton";
import type { BuildLog } from "@/lib/supabase";

export default function PostForm({ onSuccess }: { onSuccess?: (log: BuildLog) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function fireConfetti() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x, y },
      colors: ["#6366f1", "#a5b4fc", "#818cf8", "#34d399", "#22d3ee", "#ededf5"],
      ticks: 250,
      gravity: 0.85,
      scalar: 1.0,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitBuildLog(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        fireConfetti();
        if (result.log) onSuccess?.(result.log);
      }
    });
  }

  return (
    /* Animated gradient border wrapper */
    <div
      className="rounded-[13px] p-[1px] animate-gradient bg-[length:300%_300%]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(52,211,153,0.3), rgba(165,180,252,0.5), rgba(52,211,153,0.2), rgba(99,102,241,0.6))",
      }}
    >
      <div
        className="magic-card p-6"
        style={{ "--card-color": "#34d399" } as CSSProperties}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-2 h-2 rounded-full live-dot"
            style={{ backgroundColor: "#34d399" }}
          />
          <span className="text-xs font-medium text-muted uppercase tracking-widest font-mono">
            post_a_ship
          </span>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            className="input-field w-full px-4 py-3 text-sm"
          />
          <textarea
            name="description"
            placeholder="What did you build or work on this week?"
            required
            rows={4}
            className="input-field w-full px-4 py-3 text-sm resize-none"
          />
          <input
            name="project_link"
            type="url"
            placeholder="Link to your project (optional)"
            className="input-field w-full px-4 py-3 text-sm"
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <div className="pt-1">
            <ShimmerButton
              ref={buttonRef}
              type="submit"
              disabled={isPending}
              shimmerColor="#ffffff"
              background="rgba(99, 102, 241, 1)"
            >
              {isPending ? "Posting…" : "Ship It →"}
            </ShimmerButton>
          </div>
        </form>
      </div>
    </div>
  );
}
