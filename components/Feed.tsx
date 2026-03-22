"use client";

import { useEffect, useState } from "react";
import { supabase, type BuildLog } from "@/lib/supabase";
import FeedCard from "./FeedCard";

export default function Feed({ initial }: { initial: BuildLog[] }) {
  const [logs, setLogs] = useState<BuildLog[]>(initial);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

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
          setNewIds((prev) => new Set(prev).add(incoming.id));
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              next.delete(incoming.id);
              return next;
            });
          }, 600);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (logs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#3a3a5a] text-4xl mb-3">📭</p>
        <p className="text-[#6b6b8a] text-sm">No ships yet. Be the first to post.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {logs.map((log, i) => (
        <FeedCard
          key={log.id}
          log={log}
          isNew={newIds.has(log.id)}
          index={i}
        />
      ))}
    </div>
  );
}
