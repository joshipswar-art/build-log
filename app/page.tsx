import { supabase, type BuildLog } from "@/lib/supabase";
import PostForm from "@/components/PostForm";
import Feed from "@/components/Feed";

export default async function Page() {
  const { data } = await supabase
    .from("build_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const logs: BuildLog[] = data ?? [];

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#111118] border border-[#1e1e2e] rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] live-dot" />
            <span className="text-xs text-[#6b6b8a] font-medium tracking-wide uppercase">
              Live feed
            </span>
          </div>
          <h1 className="gradient-text text-4xl font-bold tracking-tight mb-2">
            Build Log
          </h1>
          <p className="text-[#6b6b8a] text-sm">
            What&apos;s your cohort shipping this week?
          </p>
        </div>

        {/* Form */}
        <PostForm />

        {/* Stats */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#1e1e2e]" />
          <span className="text-xs text-[#3a3a5a]">
            {logs.length} {logs.length === 1 ? "ship" : "ships"}
          </span>
          <div className="h-px flex-1 bg-[#1e1e2e]" />
        </div>

        {/* Feed */}
        <Feed initial={logs} />
      </div>
    </main>
  );
}
