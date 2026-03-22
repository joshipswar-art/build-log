import type { BuildLog } from "@/lib/supabase";
import FeedCard from "./FeedCard";

export default function Feed({
  logs,
  newIds,
}: {
  logs: BuildLog[];
  newIds: Set<string>;
}) {
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
