export const dynamic = "force-dynamic";

import { supabase, type BuildLog } from "@/lib/supabase";
import BuildLogClient from "@/components/BuildLogClient";
import { Spotlight } from "@/components/Spotlight";
import { AnimatedGradientBadge, AnimatedGradientHeading } from "@/components/AnimatedGradientText";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default async function Page() {
  const { data } = await supabase
    .from("build_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const logs: BuildLog[] = data ?? [];

  return (
    <main className="min-h-screen px-4 py-12 overflow-hidden">
      {/* Spotlight beam */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      </div>

      <div className="relative max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <AnimatedGradientBadge>
            <div className="flex items-center gap-2 text-accent-bright">
              <div className="w-1.5 h-1.5 rounded-full bg-ship live-dot" />
              <span className="uppercase tracking-wider">Live feed</span>
            </div>
          </AnimatedGradientBadge>

          <h1 className="text-5xl font-bold tracking-tight mt-5 mb-3">
            <AnimatedGradientHeading>Build Log</AnimatedGradientHeading>
          </h1>

          <p className="text-muted text-sm">
            What&apos;s your cohort shipping this week?
          </p>
        </div>

        {/* Divider with animated counter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <span className="text-xs text-dim tabular-nums">
            <AnimatedCounter target={logs.length} />{" "}
            {logs.length === 1 ? "ship" : "ships"}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>

        {/* Form + Feed (client, shared state) */}
        <BuildLogClient initial={logs} />
      </div>
    </main>
  );
}
