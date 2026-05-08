import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DeleteConfirmationButton } from "@/components/tasks/delete-confirmation-button";
import { TaskHeadForm } from "@/components/tasks/task-head-form";
import { getProjectById } from "@/lib/data/db-data";
import { formatArea, formatDate } from "@/lib/utils";

export default async function TaskHeadsPage(props: PageProps<"/projects/[id]/task-heads">) {
  const { id } = await props.params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="animate-page-in space-y-6">
      <Link
        href={`/projects/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-3.5" />
        Back to {project.project_name}
      </Link>

      <PageHeader
        eyebrow="Task Heads"
        title={`${project.project_name} — Scope of Work`}
        description="Task heads organize specific tasks and progress while the project area remains fixed from project setup."
      />

      <SectionCard
        title="Add Task Head"
        description="Create a scope-of-work package before adding specific tasks under it."
      >
        <TaskHeadForm projectId={project.id} />
      </SectionCard>

      <div className="grid gap-5">
        {project.task_heads.length === 0 ? (
          <SectionCard
            title="No task heads yet"
            description="Add the first scope-of-work package above to start building the project register."
          >
            <p className="text-sm text-slate-500">
              Task heads organize completed area, progress, and status from their specific tasks without changing the fixed project area.
            </p>
          </SectionCard>
        ) : project.task_heads.map((head) => (
          <SectionCard
            key={head.id}
            title={head.name}
            description={`${head.tasks.length} specific task${head.tasks.length !== 1 ? "s" : ""}`}
            action={
              <div className="flex flex-wrap justify-end gap-2">
                <StatusBadge status={head.status} />
                <DeleteConfirmationButton
                  id={head.id}
                  name={head.name}
                  kind="task head"
                  childCount={head.tasks.length}
                />
              </div>
            }
            contentClassName="space-y-5"
          >
            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                {head.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                <CalendarClock className="size-3.5 text-slate-400" />
                {formatDate(head.start_date)} — {formatDate(head.end_date)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                <Users className="size-3.5 text-slate-400" />
                {head.tasks.reduce((s, t) => s + t.skilled_workers, 0)} skilled /{" "}
                {head.tasks.reduce((s, t) => s + t.helpers, 0)} helpers
              </span>
            </div>

            {/* Progress */}
            <ProgressSummary
              label="Task head progress"
              value={head.progress_percentage}
              leftCaption={`${formatArea(head.completed_area)} completed`}
              rightCaption={`${formatArea(head.target_area)} target`}
            />

            {/* Task cards */}
            <div>
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Specific Tasks
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {head.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <Link
                      href={`/projects/${project.id}/tasks/${task.id}/edit`}
                      className="absolute inset-0 z-10 rounded-xl"
                      aria-label={`Edit ${task.name}`}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {task.name}
                      </p>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={task.status} showIcon={false} />
                        <div className="relative z-20">
                          <DeleteConfirmationButton
                            id={task.id}
                            name={task.name}
                            kind="task"
                            size="xs"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <ProgressSummary
                        label="Progress"
                        value={task.progress_percentage}
                        leftCaption={formatArea(task.completed_area)}
                        rightCaption={formatArea(task.target_area)}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        {task.skilled_workers} skilled
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        {task.helpers} helpers
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        {task.output_per_hour} {task.unit}/hr x {task.time_hours}h
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        Daily skilled {formatArea(task.daily_output)}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        Daily labor {formatArea(task.daily_labor_output)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
