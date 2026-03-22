"use client";

import { useRef, useState, useTransition } from "react";
import { submitBuildLog } from "@/app/actions";

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      }
    });
  }

  return (
    <div className="magic-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[#6366f1] live-dot" />
        <span className="text-xs font-medium text-[#6b6b8a] uppercase tracking-wider">
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

        <button
          type="submit"
          disabled={isPending}
          className="btn-glow w-full py-3 text-sm font-semibold text-white cursor-pointer"
        >
          <span>{isPending ? "Posting…" : "Ship It →"}</span>
        </button>
      </form>
    </div>
  );
}
