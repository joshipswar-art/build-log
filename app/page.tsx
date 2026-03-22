export const dynamic = "force-dynamic";

import { supabase, type BuildLog } from "@/lib/supabase";
import BuildLogClient from "@/components/BuildLogClient";
import { AuroraBackground } from "@/components/AuroraBackground";
import { AnimatedGradientBadge } from "@/components/AnimatedGradientText";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TerminalText } from "@/components/TerminalText";

export default async function Page() {
  const { data } = await supabase
    .from("build_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const logs: BuildLog[] = data ?? [];

  return (
    <main className="min-h-screen px-4 py-14 overflow-hidden">
      <AuroraBackground />

      <div className="relative max-w-5xl mx-auto">

        {/* Hero */}
        <div className="mb-14 text-center">

          {/* Badge row */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <AnimatedGradientBadge>
              <div className="flex items-center gap-2 text-accent-bright">
                <div
                  className="w-1.5 h-1.5 rounded-full live-dot"
                  style={{ backgroundColor: "#34d399" }}
                />
                <span className="uppercase tracking-wider">Live feed</span>
              </div>
            </AnimatedGradientBadge>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs backdrop-blur-sm">
              <span className="tabular-nums font-bold text-fg">
                <AnimatedCounter target={logs.length} />
              </span>
              <span className="text-muted">{logs.length === 1 ? "ship" : "ships"}</span>
            </div>
          </div>

          {/* Title — full typewriter on one line */}
          <div
            className="font-medium tracking-tight mb-6 text-[clamp(2.8rem,7vw,5.5rem)] leading-none"
            style={{ fontFamily: "var(--font-terminal)", color: "#34d399" }}
          >
            <TerminalText text="Build log" charDelay={100} />
          </div>

          <p className="text-muted text-base max-w-xs mx-auto leading-relaxed">
            What&apos;s your cohort shipping this week?
          </p>
        </div>

        {/* Two-column layout */}
        <BuildLogClient initial={logs} />
      </div>
    </main>
  );
}
