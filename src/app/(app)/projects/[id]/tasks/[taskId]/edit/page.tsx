import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { TaskForm } from "@/components/tasks/task-form";
import { getProjectById } from "@/lib/data/db-data";

export default async function EditTaskPage(
  props: { params: Promise<{ id: string; taskId: string }> },
) {
  const { id, taskId } = await props.params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const task = project.task_heads
    .flatMap((head) => head.tasks)
    .find((taskItem) => taskItem.id === taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-3.5" />
        Back to {project.project_name}
      </Link>

      <PageHeader
        eyebrow="Specific Tasks"
        title={`Edit ${task.name}`}
        description="Update the task setup details. Progress values remain driven by progress updates."
      />

      <TaskForm
        mode="edit"
        projectId={project.id}
        taskId={task.id}
        taskHeads={project.task_heads}
        defaultValues={{
          task_head_id: task.task_head_id,
          name: task.name,
          target_area: task.target_area,
          unit: task.unit,
          start_date: task.start_date,
          end_date: task.end_date,
          supervisor_workers: task.supervisor_workers,
          foreman_workers: task.foreman_workers,
          carpenter_workers: task.carpenter_workers,
          mason_workers: task.mason_workers,
          steelman_workers: task.steelman_workers,
          welder_workers: task.welder_workers,
          painter_workers: task.painter_workers,
          operator_workers: task.operator_workers,
          skilled_workers: task.skilled_workers,
          helpers: task.helpers,
          worker_trade: task.worker_trade,
          output_per_hour: task.output_per_hour,
          time_hours: task.time_hours,
          weeks_per_month: task.weeks_per_month,
          days_per_month: task.days_per_month,
          standard_output: task.standard_output,
          status: task.status,
        }}
      />
    </div>
  );
}
