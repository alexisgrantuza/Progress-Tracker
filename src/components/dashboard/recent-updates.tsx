import { ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { formatArea, formatDate, formatPercent } from "@/lib/utils";
import type { RecentProgressUpdate } from "@/types/progress";

const updateTypeColors: Record<string, string> = {
  Weekly: "bg-slate-100 text-slate-700 border-slate-200",
  Monthly: "bg-slate-100 text-slate-700 border-slate-200",
};

export function RecentUpdates({ updates }: { updates: RecentProgressUpdate[] }) {
  const recent = updates.slice(0, 5);

  return (
    <SectionCard
      title="Recent Progress Updates"
      description="Latest weekly and monthly site submissions with computed progress snapshots."
      contentClassName="max-h-[520px] space-y-3 overflow-y-auto pr-2"
    >
      {recent.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No updates captured yet"
          description="New weekly and monthly entries from supervisors will appear here."
        />
      ) : (
        recent.map((update) => (
          <div
            key={update.id}
            className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{update.task_name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{update.project_name}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                    updateTypeColors[update.update_type] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {update.update_type}
                </span>
                <span className="text-[11px] text-slate-400">{formatDate(update.date_covered)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <span>
                Completed area:{" "}
                <span className="font-semibold text-slate-700">
                  {formatArea(update.actual_completed_area)}
                </span>
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white tabular-nums">
                {formatPercent(update.progress_percentage)}
              </span>
            </div>
            {update.remarks ? (
              <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">{update.remarks}</p>
            ) : null}
          </div>
        ))
      )}
    </SectionCard>
  );
}
