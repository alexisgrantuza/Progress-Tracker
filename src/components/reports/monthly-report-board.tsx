import Link from "next/link";
import { ArrowRight, AlertTriangle, ClipboardList, Siren, Wrench } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { MonthlyReportSummary } from "@/types/progress";

export function MonthlyReportBoard({ reports }: { reports: MonthlyReportSummary[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {reports.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No monthly reports available"
          description="Report summaries will appear here once projects start generating monthly health snapshots."
          className="xl:col-span-2"
        />
      ) : (
        reports.map((report) => (
          <SectionCard
            key={report.id}
            title={report.projectName}
            description={report.month}
            action={<StatusBadge status={report.status as never} />}
            contentClassName="space-y-5"
          >
            {/* Summary */}
            <p className="text-sm leading-relaxed text-slate-600">{report.summary}</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-orange-600">
                  <AlertTriangle className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Delayed</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-slate-900">{report.delayedTasks}</p>
                <p className="text-[11px] text-slate-500">tasks</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-rose-600">
                  <Siren className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Critical</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-slate-900">{report.criticalTasks}</p>
                <p className="text-[11px] text-slate-500">tasks</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-rose-600">
                  <Wrench className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Labor</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-slate-900">
                  {report.laborProductivityIssues}
                </p>
                <p className="text-[11px] text-slate-500">issues</p>
              </div>
            </div>

            {/* Suggested action */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Suggested Action
              </p>
              <p className="font-semibold text-slate-900">{report.suggestedAction}</p>
            </div>

            {/* CTA */}
            <div className="border-t border-slate-100 pt-3">
              <Link
                href={`/projects/${report.projectId}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                Open project context
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </SectionCard>
        ))
      )}
    </div>
  );
}
