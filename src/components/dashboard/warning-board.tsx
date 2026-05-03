import { AlertTriangle, Siren, Wrench } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/shared/section-card";
import { formatArea, formatDate } from "@/lib/utils";
import type { TaskSummary } from "@/types/project";

const statusPriority: Record<string, number> = {
  Critical: 0,
  "Labor Productivity Issue": 1,
  Delayed: 2,
  "At Risk": 3,
};

const urgencyConfig: Record<string, { bg: string; icon: typeof AlertTriangle }> = {
  Critical: { bg: "border-rose-200 bg-rose-50/50", icon: Siren },
  "Labor Productivity Issue": { bg: "border-rose-200 bg-rose-50/50", icon: Wrench },
  Delayed: { bg: "border-orange-200 bg-orange-50/50", icon: AlertTriangle },
  "At Risk": { bg: "border-amber-200 bg-amber-50/50", icon: AlertTriangle },
};

export function WarningBoard({ tasks }: { tasks: TaskSummary[] }) {
  const flagged = tasks
    .filter((task) =>
      ["At Risk", "Delayed", "Critical", "Labor Productivity Issue"].includes(task.status),
    )
    .sort(
      (a, b) =>
        (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99),
    );

  return (
    <SectionCard
      title="Warnings & Critical Work"
      description="Tasks requiring immediate attention — sorted by severity. Address critical and labor productivity issues first."
      contentClassName="space-y-3"
    >
      {flagged.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No flagged work right now"
          description="At-risk, delayed, critical, and labor productivity issue tasks will surface here automatically."
        />
      ) : (
        flagged.map((task) => {
          const config = urgencyConfig[task.status] ?? urgencyConfig["At Risk"];
          const UrgencyIcon = config.icon;
          return (
            <div
              key={task.id}
              className={`rounded-xl border p-4 ${config.bg}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                    <UrgencyIcon className="size-3.5 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{task.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Target {formatArea(task.target_area)} · Remaining{" "}
                      {formatArea(task.productivity.remainingArea)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-lg bg-white/60 px-3 py-2">
                  <p className="text-slate-400">Expected output</p>
                  <p className="mt-0.5 font-semibold text-slate-700">
                    {formatArea(task.productivity.expectedOutput)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/60 px-3 py-2">
                  <p className="text-slate-400">Worker sets</p>
                  <p className="mt-0.5 font-semibold text-slate-700">
                    {task.productivity.workerSets}
                  </p>
                </div>
                <div className="rounded-lg bg-white/60 px-3 py-2 col-span-2 sm:col-span-1">
                  <p className="text-slate-400">Deadline</p>
                  <p className="mt-0.5 font-semibold text-slate-700">
                    {formatDate(task.end_date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </SectionCard>
  );
}
