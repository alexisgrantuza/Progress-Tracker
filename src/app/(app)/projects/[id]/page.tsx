import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, CircleFadingArrowUp, Edit, Hammer, Layers, Ruler } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { getProjectById } from "@/lib/data/sample-data";
import { formatArea, formatDate, formatPercent } from "@/lib/utils";

export default async function ProjectDetailsPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const stats = [
    {
      icon: Ruler,
      label: "Target Area",
      sub: "Rolled up from task heads",
      value: formatArea(project.total_target_area),
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      icon: Hammer,
      label: "Completed Area",
      sub: "Current accumulated output",
      value: formatArea(project.total_completed_area),
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      icon: CircleFadingArrowUp,
      label: "Overall Progress",
      sub: "Auto-computed completion",
      value: `${project.overall_progress}%`,
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      icon: Layers,
      label: "Task Heads",
      sub: "Scoped work packages",
      value: String(project.task_heads.length),
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="animate-page-in space-y-6">
      {/* Back nav */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-3.5" />
        Back to projects
      </Link>

      <PageHeader
        eyebrow="Project details"
        title={project.project_name}
        description={`Location: ${project.location}. Project totals are derived from Task Heads and specific task completions.`}
        action={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${project.id}/edit`}>
                <Edit className="size-3.5" />
                Edit project
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/projects/${project.id}/task-heads`}>
                <Layers className="size-3.5" />
                Manage task heads
              </Link>
            </Button>
          </>
        }
      />

      {/* Status + stat row */}
      <div className="flex items-center gap-3 flex-wrap">
        <StatusBadge status={project.status} />
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
          <CalendarClock className="size-3.5 text-slate-400" />
          {formatDate(project.start_date)} — {formatDate(project.end_date)}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-4 rounded-xl border border-slate-200 p-4 shadow-sm ${stat.accent}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">{stat.sub}</p>
                <p className="font-heading text-xl font-bold tabular-nums text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline progress */}
      <SectionCard
        title="Project Timeline & Progress"
        description="Schedule range and current completion against total scoped area."
      >
        <ProgressSummary
          label="Project completion"
          value={project.overall_progress}
          leftCaption={`${formatArea(project.total_completed_area)} completed`}
          rightCaption={`of ${formatArea(project.total_target_area)} target`}
        />
      </SectionCard>

      {/* Task head cards */}
      <SectionCard
        title="Task Head Summary"
        description="Each task head rolls up progress and completed area from its specific tasks."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}/tasks`}>View all tasks</Link>
          </Button>
        }
        contentClassName="space-y-5"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {project.task_heads.map((head) => (
            <div
              key={head.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{head.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatDate(head.start_date)} — {formatDate(head.end_date)}
                  </p>
                </div>
                <StatusBadge status={head.status} />
              </div>
              <ProgressSummary
                label="Task head progress"
                value={head.progress_percentage}
                leftCaption={`${formatArea(head.completed_area)} done`}
                rightCaption={`${formatArea(head.target_area)} target`}
                className="mt-3"
              />
            </div>
          ))}
        </div>

        {/* Summary table */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            All Task Heads
          </p>
          <div className="table-wrapper rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  {["Task Head", "Schedule", "Area", "Progress", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.task_heads.map((head) => (
                  <tr key={head.id} className="bg-white hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900">{head.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(head.start_date)} — {formatDate(head.end_date)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatArea(head.completed_area)} / {formatArea(head.target_area)}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700 tabular-nums">
                      {formatPercent(head.progress_percentage)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={head.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
