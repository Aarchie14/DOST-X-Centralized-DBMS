// Defining it directly here bypasses the broken import completely!
export interface ActivityLog {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const typeStyles = {
    CREATE: "bg-green-500/10 text-green-700 border-green-500/20",
    UPDATE: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    DELETE: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  };

  const safeActivities = activities || [];

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs max-w-xs w-full h-fit space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          System Activity Log
        </h4>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">
          {safeActivities.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {safeActivities.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium italic text-center py-4">
            No recent actions logged.
          </p>
        ) : (
          safeActivities.map((log) => (
            <div
              key={log?.id || Math.random().toString()}
              className="text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm border ${
                    log?.type
                      ? typeStyles[log.type]
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {log?.type || "INFO"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">
                  {log?.timestamp?.includes(" | ")
                    ? log.timestamp.split(" | ")[0]
                    : log?.timestamp || "00:00"}
                </span>
              </div>
              <p className="text-slate-600 font-medium line-clamp-2">
                {log?.message || "No message provided."}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
