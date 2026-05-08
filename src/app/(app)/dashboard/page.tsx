import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Hourglass,
  MapPinned,
  Siren,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { ProgressDistributionChart } from "@/components/dashboard/progress-distribution-chart";
import { RecentUpdates } from "@/components/dashboard/recent-updates";
import { TaskProgressCard } from "@/components/dashboard/task-progress-card";
import { WarningBoard } from "@/components/dashboard/warning-board";
import { SectionCard } from "@/components/shared/section-card";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { StatusBadge } from "@/components/shared/status-badge";
import { getAppDataset } from "@/lib/data/db-data";
import { formatArea } from "@/lib/utils";

export default async function DashboardPage() {
  const dataset = await getAppDataset();
  const ongoingProjects = dataset.projects.filter((p) => p.status !== "Completed");
  const completedProjects = dataset.projects.filter((p) => p.status === "Completed");
  const delayedTasks = dataset.tasks.filter((t) => t.status === "Delayed");
  const criticalTasks = dataset.tasks.filter((t) => t.status === "Critical");
  const laborIssues = dataset.tasks.filter((t) => t.status === "Labor Productivity Issue");
  const overallProgress =
    dataset.projects.length > 0
      ? dataset.projects.reduce((sum, p) => sum + p.overall_progress, 0) /
        dataset.projects.length
      : 0;
  const mostAdvancedProject = [...dataset.projects].sort(
    (a, b) => b.overall_progress - a.overall_progress,
  )[0];

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Construction Dashboard"
        description="Track portfolio progress, labor output, and tasks that need intervention before schedule slippage spreads."
      />

      {/* ── KPI metric cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={BriefcaseBusiness}
          label="Total Projects"
          value={String(dataset.projects.length)}
          change="Active portfolio"
          tone="default"
        />
        <MetricCard
          icon={Hourglass}
          label="Ongoing"
          value={String(ongoingProjects.length)}
          change="In progress"
          tone="warning"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Completed"
          value={String(completedProjects.length)}
          change="Closed deliverables"
          tone="good"
        />
        <MetricCard
          icon={Gauge}
          label="Avg. Progress"
          value={`${overallProgress.toFixed(1)}%`}
          change="Portfolio completion"
          tone="good"
        />
        <MetricCard
          icon={Siren}
          label="Critical Tasks"
          value={String(criticalTasks.length)}
          change="Action required"
          tone="danger"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Delayed Tasks"
          value={String(delayedTasks.length)}
          change="Behind schedule"
          tone="warning"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Labor Issues"
          value={String(laborIssues.length)}
          change="Below expected output"
          tone="danger"
        />
        <MetricCard
          icon={ClipboardList}
          label="Updates Logged"
          value={String(dataset.progressUpdates.length)}
          change="Total submissions"
          tone="default"
        />
      </div>

      {/* ── Portfolio snapshot + lead project ── */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Portfolio Snapshot"
          description="High-level delivery pace and output health across active construction work."
          contentClassName="space-y-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Projects tracked", value: dataset.projects.length },
              { label: "Tasks monitored", value: dataset.tasks.length },
              { label: "Progress updates", value: dataset.progressUpdates.length },
              { label: "Tracked output (latest)", value: `${dataset.productivityMonthly.at(-1)?.actual.toFixed(0) ?? 0} m²` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
          <ProgressSummary
            label="Average overall project progress"
            value={overallProgress}
            leftCaption={`${ongoingProjects.length} ongoing projects`}
            rightCaption={`${completedProjects.length} completed`}
          />
        </SectionCard>

        {mostAdvancedProject ? (
          <SectionCard
            title="Lead Project"
            description="Best-performing project based on overall completion."
            contentClassName="space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold text-slate-900 truncate">
                  {mostAdvancedProject.project_name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPinned className="size-3.5 text-slate-400" />
                  {mostAdvancedProject.location}
                </p>
              </div>
              <StatusBadge status={mostAdvancedProject.status} />
            </div>
            <ProgressSummary
              label="Overall progress"
              value={mostAdvancedProject.overall_progress}
              leftCaption={formatArea(mostAdvancedProject.total_completed_area)}
              rightCaption={`of ${formatArea(mostAdvancedProject.total_target_area)}`}
            />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Task heads", value: mostAdvancedProject.task_heads.length },
                {
                  label: "Critical",
                  value: mostAdvancedProject.task_heads
                    .flatMap((h) => h.tasks)
                    .filter((t) => t.status === "Critical").length,
                },
                {
                  label: "Updates",
                  value: dataset.progressUpdates.filter(
                    (u) => u.project_name === mostAdvancedProject.project_name,
                  ).length,
                },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-medium text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}
      </div>

      {/* ── Charts row ── */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <ProductivityChart data={dataset.productivityMonthly} />
        <ProgressDistributionChart
          data={[
            { name: "On Track", value: dataset.tasks.filter((t) => t.status === "On Track").length },
            { name: "At Risk", value: dataset.tasks.filter((t) => t.status === "At Risk").length },
            { name: "Delayed", value: delayedTasks.length },
            { name: "Critical", value: criticalTasks.length },
            { name: "Labor Issue", value: laborIssues.length },
            { name: "Completed", value: dataset.tasks.filter((t) => t.status === "Completed").length },
          ]}
        />
      </div>

      {/* ── Recent updates + action summary ── */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentUpdates updates={dataset.progressUpdates} />
        <SectionCard
          title="Action Summary"
          description="Portfolio signals for site leaders to review first."
          contentClassName="space-y-3"
        >
          {[
            {
              icon: AlertTriangle,
              iconClass: "bg-amber-50 text-amber-600",
              label: "At-risk or delayed",
              sub: "Weekly attention needed",
              value: dataset.tasks.filter((t) => ["At Risk", "Delayed"].includes(t.status)).length,
            },
            {
              icon: ClipboardList,
              iconClass: "bg-slate-100 text-slate-600",
              label: "Latest submissions",
              sub: "Recent weekly/monthly",
              value: dataset.progressUpdates.length,
            },
            {
              icon: Siren,
              iconClass: "bg-rose-50 text-rose-600",
              label: "Critical exposure",
              sub: "Needs intervention",
              value: criticalTasks.length,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold tabular-nums text-slate-900">{item.value}</span>
              </div>
            );
          })}
        </SectionCard>
      </div>

      {/* ── Per-project task breakdown ── */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
          Project Breakdowns
        </p>
        <div className="grid gap-5">
          {dataset.projects.map((project) => (
            <TaskProgressCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <WarningBoard tasks={dataset.tasks} />
    </div>
  );
}
