"use client";

import { useRef, useState, useTransition } from "react";
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
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ["#6366f1", "#a5b4fc", "#818cf8", "#34d399", "#ededf5"],
      ticks: 200,
      gravity: 0.9,
      scalar: 0.9,
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
    <div className="magic-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-ship live-dot" />
        <span className="text-xs font-medium text-muted uppercase tracking-wider">
          Post a Ship
        </span>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          rows={3}
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

        <ShimmerButton
          ref={buttonRef}
          type="submit"
          disabled={isPending}
          shimmerColor="#ffffff"
          background="rgba(99, 102, 241, 1)"
        >
          {isPending ? "Posting…" : "Ship It →"}
        </ShimmerButton>
      </form>
    </div>
  );
}
