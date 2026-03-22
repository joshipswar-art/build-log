"use client";

import { CSSProperties, useEffect, useRef } from "react";
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

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Mouse glow tracking
      card!.style.setProperty("--mouse-x", `${x}px`);
      card!.style.setProperty("--mouse-y", `${y}px`);

      // 3D tilt
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 6;
      card!.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    }

    function handleMouseLeave() {
      card!.style.transition = "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)";
      card!.style.transform = "";
      setTimeout(() => {
        if (card) card.style.transition = "";
      }, 650);
    }

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const avatarColor = getAvatarColor(log.name);
  const initial = log.name.charAt(0).toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });
  const staggerDelay = isNew ? 0 : Math.min(index * 60, 400);

  return (
    <div
      ref={cardRef}
      className={`magic-card group${isNew ? " is-new" : ""}`}
      style={{
        "--card-color": avatarColor,
        animationName: "fadeSlideIn",
        animationDuration: "0.4s",
        animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        animationFillMode: "both",
        animationDelay: `${staggerDelay}ms`,
      } as CSSProperties}
    >
      {/* Left color bar with glow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 opacity-50 group-hover:opacity-100 rounded-l-[12px]"
        style={{
          backgroundColor: avatarColor,
          boxShadow: `0 0 16px 2px ${avatarColor}50`,
        }}
      />

      <div className="px-5 py-4 pl-6">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
            style={{
              backgroundColor: avatarColor,
              boxShadow: `0 0 0 2px ${avatarColor}30`,
            }}
          >
            {initial}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-semibold text-fg text-sm">{log.name}</span>
              <span className="text-dim text-xs">·</span>
              <span className="text-muted text-xs tabular-nums">{timeAgo}</span>
            </div>
            <p className="text-fg/75 text-sm leading-relaxed">{log.description}</p>
            {log.project_link && (
              <a
                href={log.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-accent-soft hover:text-accent-bright transition-colors group/link"
              >
                <svg
                  className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 transition-opacity"
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
        </div>
      </div>
    </div>
  );
}
