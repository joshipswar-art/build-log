"use client";

import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import type { BuildLog } from "@/lib/supabase";

const AVATAR_COLORS = [
  "#6366f1", "#818cf8", "#a78bfa", "#34d399",
  "#22d3ee", "#60a5fa", "#c084fc", "#f472b6",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function FeedCard({
  log,
  isNew = false,
  index = 0,
}: {
  log: BuildLog;
  isNew?: boolean;
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track mouse for magic glow
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    function handleMouseMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      card!.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card!.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const avatarColor = getAvatarColor(log.name);
  const initial = log.name.charAt(0).toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });

  // Stagger delay capped at 400ms
  const staggerDelay = isNew ? 0 : Math.min(index * 60, 400);

  return (
    <div
      ref={cardRef}
      className="magic-card p-5"
      style={{
        animationName: "fadeSlideIn",
        animationDuration: "0.35s",
        animationTimingFunction: "ease",
        animationFillMode: "both",
        animationDelay: `${staggerDelay}ms`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initial}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-fg text-sm">{log.name}</span>
            <span className="text-dim text-xs">·</span>
            <span className="text-muted text-xs">{timeAgo}</span>
          </div>
          <p className="text-fg/75 text-sm leading-relaxed">{log.description}</p>
          {log.project_link && (
            <a
              href={log.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-accent-soft hover:text-accent-bright transition-colors group"
            >
              <svg
                className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 10l4-4M10 6H7M10 6v3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="2" width="12" height="12" rx="2" />
              </svg>
              View Project
            </a>
          )}
        </div>

        {/* Colored accent dot matching avatar */}
        <div
          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 opacity-40"
          style={{ backgroundColor: avatarColor }}
        />
      </div>
    </div>
  );
}
