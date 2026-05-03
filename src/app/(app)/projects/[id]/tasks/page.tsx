import { notFound } from "next/navigation";
import { ClipboardList, HardHat } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskForm } from "@/components/tasks/task-form";
import { getProjectById } from "@/lib/data/sample-data";
import { formatArea, formatDate } from "@/lib/utils";

export default async function ProjectTasksPage(props: PageProps<"/projects/[id]/tasks">) {
  const { id } = await props.params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const tasks = project.task_heads.flatMap((head) =>
    head.tasks.map((task) => ({ ...task, taskHeadName: head.name })),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Specific Tasks"
        title={`${project.project_name} task register`}
        description="This table drives progress computation, status classification, and labor productivity detection."
      />
      <SectionCard
        title="Specific tasks"
        description="Read each task by scope, manpower, schedule, progress, and status without losing mobile readability."
      >
        {tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No tasks found"
            description="Specific tasks linked to this project will appear here once task heads are populated."
          />
        ) : (
          <>
            <div className="grid gap-4 md:hidden">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{task.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{task.taskHeadName}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <ProgressSummary
                      label="Task progress"
                      value={task.progress_percentage}
                      leftCaption={formatArea(task.completed_area)}
                      rightCaption={formatArea(task.target_area)}
                    />
                    <div className="grid gap-2 text-sm text-slate-600">
                      <div>{formatDate(task.start_date)} - {formatDate(task.end_date)}</div>
                      <div className="inline-flex items-center gap-2">
                        <HardHat className="size-4 text-slate-400" />
                        {task.skilled_workers} skilled / {task.helpers} helpers
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Task Head</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Manpower</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <p className="font-medium text-slate-950">{task.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatArea(task.completed_area)} / {formatArea(task.target_area)}
                        </p>
                      </TableCell>
                      <TableCell>{task.taskHeadName}</TableCell>
                      <TableCell>{formatDate(task.start_date)} - {formatDate(task.end_date)}</TableCell>
                      <TableCell>{task.skilled_workers} skilled / {task.helpers} helpers</TableCell>
                      <TableCell className="min-w-[220px]">
                        <ProgressSummary label="Progress" value={task.progress_percentage} />
                      </TableCell>
                      <TableCell><StatusBadge status={task.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </SectionCard>
      <SectionCard
        title="Task setup validator"
        description="Use the form below to validate manpower, standard output, and the required 1 skilled : 2 helpers rule."
      >
        <TaskForm />
      </SectionCard>
    </div>
  );
}
