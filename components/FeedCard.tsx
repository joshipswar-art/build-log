"use client";

import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import type { BuildLog } from "@/lib/supabase";

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#06b6d4",
  "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
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
}: {
  log: BuildLog;
  isNew?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track mouse position for magic glow
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

  return (
    <div
      ref={cardRef}
      className={`magic-card p-5 ${isNew ? "animate-entry" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
          style={{ backgroundColor: avatarColor }}
        >
          {initial}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#e2e2f0] text-sm">{log.name}</span>
            <span className="text-[#3a3a5a] text-xs">·</span>
            <span className="text-[#6b6b8a] text-xs">{timeAgo}</span>
          </div>
          <p className="text-[#b0b0cc] text-sm leading-relaxed">{log.description}</p>
          {log.project_link && (
            <a
              href={log.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#818cf8] hover:text-[#a5b4fc] transition-colors"
            >
              <span className="w-3.5 h-3.5 opacity-70">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 10l4-4M10 6H7M10 6v3" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                </svg>
              </span>
              View Project
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
