import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatArea, formatDate } from "@/lib/utils";
import type { ProjectSummary } from "@/types/project";

export function TaskProgressCard({ project }: { project: ProjectSummary }) {
  return (
    <SectionCard
      title={project.project_name}
      description={project.location}
      action={<StatusBadge status={project.status} />}
      contentClassName="space-y-5"
    >
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">
          <MapPin className="size-3.5 text-slate-400" />
          {project.location}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">
          <CalendarDays className="size-3.5 text-slate-400" />
          {formatDate(project.start_date)} — {formatDate(project.end_date)}
        </span>
      </div>

      <ProgressSummary
        label="Overall project progress"
        value={project.overall_progress}
        leftCaption={`${formatArea(project.total_completed_area)} completed`}
        rightCaption={`of ${formatArea(project.total_target_area)}`}
      />

      {project.task_heads.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Task Heads
          </p>
          <div className="grid gap-3 xl:grid-cols-2">
            {project.task_heads.slice(0, 4).map((head) => (
              <div
                key={head.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{head.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatArea(head.completed_area)} / {formatArea(head.target_area)}
                    </p>
                  </div>
                  <StatusBadge status={head.status} showIcon={false} />
                </div>
                <ProgressSummary
                  label="Progress"
                  value={head.progress_percentage}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          View full project details
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </SectionCard>
  );
}
