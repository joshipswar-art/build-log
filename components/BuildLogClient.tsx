"use client";

import { useEffect, useState } from "react";
import { supabase, type BuildLog } from "@/lib/supabase";
import PostForm from "./PostForm";
import Feed from "./Feed";

export default function BuildLogClient({ initial }: { initial: BuildLog[] }) {
  const [logs, setLogs] = useState<BuildLog[]>(initial);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Real-time: other people's posts
  useEffect(() => {
    const channel = supabase
      .channel("build_logs_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "build_logs" },
        (payload) => {
          const incoming = payload.new as BuildLog;
          setLogs((prev) => {
            if (prev.some((l) => l.id === incoming.id)) return prev;
            return [incoming, ...prev];
          });
          markNew(incoming.id);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  function markNew(id: string) {
    setNewIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNewIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }, 800);
  }

  function handleNewLog(log: BuildLog) {
    setLogs((prev) => {
      if (prev.some((l) => l.id === log.id)) return prev;
      return [log, ...prev];
    });
    markNew(log.id);
  }

  return (
    <div className="grid md:grid-cols-[380px_1fr] gap-6 md:gap-8 items-start">
      {/* Left — sticky form */}
      <div className="md:sticky md:top-8">
        <PostForm onSuccess={handleNewLog} />
      </div>

      {/* Right — scrollable feed */}
      <Feed logs={logs} newIds={newIds} />
    </div>
  );
}
