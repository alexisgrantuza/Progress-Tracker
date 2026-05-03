"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CalendarClock, X } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { formatArea, formatDate, formatPercent } from "@/lib/utils";
import type { ProjectSummary, TaskSummary } from "@/types/project";

const statusColors: Record<string, { bg: string; dot: string }> = {
  "On Track":                 { bg: "#10b981", dot: "bg-emerald-500" },
  "At Risk":                  { bg: "#f59e0b", dot: "bg-amber-500" },
  "Delayed":                  { bg: "#f97316", dot: "bg-orange-500" },
  "Critical":                 { bg: "#f43f5e", dot: "bg-rose-500" },
  "Completed":                { bg: "#0f172a", dot: "bg-slate-900" },
  "Labor Productivity Issue": { bg: "#f43f5e", dot: "bg-rose-500" },
};

type SelectedTask = { task: TaskSummary; taskHead: string; projectName: string } | null;

export function ProjectCalendar({ projects }: { projects: ProjectSummary[] }) {
  const [selectedTask, setSelectedTask] = useState<SelectedTask>(null);

  const events = useMemo(
    () =>
      projects.flatMap((project) =>
        project.task_heads.flatMap((head) =>
          head.tasks.map((task) => ({
            id: task.id,
            title: task.name,
            start: task.start_date,
            end: task.end_date,
            backgroundColor: statusColors[task.status]?.bg ?? "#94a3b8",
            borderColor: statusColors[task.status]?.bg ?? "#94a3b8",
            extendedProps: {
              projectName: project.project_name,
              taskHeadName: head.name,
              task,
            },
          })),
        ),
      ),
    [projects],
  );

  return (
    <>
      <SectionCard
        title="Schedule Calendar"
        description="Browse task windows by month or week. Click any event to view progress, scope, and productivity details."
        contentClassName="space-y-5"
      >
        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusColors).map(([label, { dot }]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              <span className={`size-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>

        {/* Calendar */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            eventClick={(info) => {
              setSelectedTask({
                task: info.event.extendedProps.task as TaskSummary,
                taskHead: info.event.extendedProps.taskHeadName as string,
                projectName: info.event.extendedProps.projectName as string,
              });
            }}
            height="auto"
            eventDisplay="block"
          />
        </div>
      </SectionCard>

      {/* Task detail panel – custom modal (no shadcn Dialog to keep it clean) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {selectedTask.projectName}
                </p>
                <h2 className="mt-1 font-heading text-lg font-bold text-slate-900 leading-snug">
                  {selectedTask.task.name}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">{selectedTask.taskHead}</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Schedule chip */}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                <CalendarClock className="size-3.5 text-slate-400" />
                {formatDate(selectedTask.task.start_date)} — {formatDate(selectedTask.task.end_date)}
              </span>

              {/* Status */}
              <StatusBadge status={selectedTask.task.status} />

              {/* KPI grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Target area", value: formatArea(selectedTask.task.target_area) },
                  { label: "Completed area", value: formatArea(selectedTask.task.completed_area) },
                  { label: "Expected output", value: formatArea(selectedTask.task.productivity.expectedOutput) },
                  { label: "Worker sets", value: String(selectedTask.task.productivity.workerSets) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-[11px] text-slate-400">{item.label}</p>
                    <p className="mt-1 font-bold tabular-nums text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <ProgressSummary
                label="Task progress"
                value={selectedTask.task.progress_percentage}
                leftCaption={`Remaining: ${formatArea(selectedTask.task.productivity.remainingArea)}`}
                rightCaption={formatPercent(selectedTask.task.progress_percentage)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
