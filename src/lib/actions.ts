"use server";

import { revalidatePath } from "next/cache";

import { calculateProgress, roundToTwo } from "@/lib/computations/progress";
import { calculateProductivityOutputs } from "@/lib/computations/productivity";
import { requireCurrentUser, requireCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  progressUpdateSchema,
  projectSchema,
  taskHeadSchema,
  taskSchema,
  type ProgressUpdateFormValues,
  type ProjectFormValues,
  type TaskFormValues,
  type TaskHeadFormValues,
} from "@/lib/validations/forms";
import type { ProjectStatus, TaskStatus } from "@/types/project";

type ActionResult = { ok: true; id?: string } | { ok: false; message: string };

function toDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

type RollupItem = {
  target_area: number;
  completed_area: number;
};

type TaskStatusItem = RollupItem & {
  status: TaskStatus;
};

type HeadStatusItem = RollupItem & {
  status: TaskStatus | ProjectStatus;
};

function calculateAreaRollup(items: RollupItem[]) {
  const totalTargetArea = roundToTwo(items.reduce((sum, item) => sum + item.target_area, 0));
  const totalCompletedArea = roundToTwo(items.reduce((sum, item) => sum + item.completed_area, 0));

  return {
    totalTargetArea,
    totalCompletedArea,
    progressPercentage: calculateProgress(totalTargetArea, totalCompletedArea),
  };
}

function calculateProjectBaselineProgress(items: RollupItem[]) {
  const totalTargetArea = roundToTwo(items.reduce((sum, item) => sum + item.target_area, 0));
  const totalCompletedArea = roundToTwo(items.reduce((sum, item) => sum + item.completed_area, 0));

  return {
    totalCompletedArea,
    progressPercentage: calculateProgress(totalTargetArea, totalCompletedArea),
  };
}

function getTaskHeadStatus(tasks: TaskStatusItem[]): TaskStatus {
  if (tasks.length === 0) return "On Track";
  if (tasks.some((task) => task.status === "Critical")) return "Critical";
  if (tasks.some((task) => task.status === "Delayed")) return "Delayed";
  if (tasks.some((task) => task.status === "Labor Productivity Issue")) return "Labor Productivity Issue";
  if (tasks.some((task) => task.status === "At Risk")) return "At Risk";
  if (tasks.every((task) => task.status === "Completed")) return "Completed";

  return "On Track";
}

function getProjectStatus(taskHeads: HeadStatusItem[], overallProgress: number): ProjectStatus {
  if (overallProgress >= 100) return "Completed";
  if (taskHeads.some((head) => head.status === "Critical")) return "Critical";
  if (taskHeads.some((head) => head.status === "Delayed")) return "Delayed";
  if (taskHeads.some((head) => head.status === "At Risk")) return "At Risk";

  return "Ongoing";
}

async function refreshProjectRollups(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      taskHeads: {
        include: {
          tasks: {
            include: {
              progressUpdates: {
                orderBy: [{ dateCovered: "desc" }, { createdAt: "desc" }],
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    return;
  }

  const headRollups = await Promise.all(
    project.taskHeads.map(async (head) => {
      const taskSummaries = await Promise.all(
        head.tasks.map(async (task) => {
          const completedArea = Number(task.completedArea);
          const targetArea = Number(task.targetArea);
          const progressPercentage = calculateProgress(targetArea, completedArea);
          const status = task.status as TaskStatus;

          await prisma.task.update({
            where: { id: task.id },
            data: {
              progressPercentage,
            },
          });

          return {
            target_area: targetArea,
            completed_area: completedArea,
            status,
          };
        }),
      );
      const progress = calculateAreaRollup(taskSummaries);
      const status = getTaskHeadStatus(taskSummaries);

      await prisma.taskHead.update({
        where: { id: head.id },
        data: {
          targetArea: progress.totalTargetArea,
          completedArea: progress.totalCompletedArea,
          progressPercentage: progress.progressPercentage,
          status,
        },
      });

      return {
        target_area: progress.totalTargetArea,
        completed_area: progress.totalCompletedArea,
        progress_percentage: progress.progressPercentage,
        status,
      };
    }),
  );
  const projectProgress = calculateProjectBaselineProgress(headRollups);

  await prisma.project.update({
    where: { id: projectId },
    data: {
      totalCompletedArea: projectProgress.totalCompletedArea,
      overallProgress: projectProgress.progressPercentage,
      status: getProjectStatus(headRollups, projectProgress.progressPercentage),
    },
  });
}

function refreshAppPaths(projectId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/progress-updates");
  revalidatePath("/calendar");
  revalidatePath("/reports");

  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/task-heads`);
    revalidatePath(`/projects/${projectId}/tasks`);
  }
}

export async function createProject(values: ProjectFormValues): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the project details." };
  }

  const user = await requireCurrentUserProfile();
  const project = await prisma.project.create({
    data: {
      projectName: parsed.data.project_name,
      location: parsed.data.location,
      totalTargetArea: parsed.data.total_target_area,
      startDate: toDate(parsed.data.start_date),
      endDate: toDate(parsed.data.end_date),
      createdById: user.id,
      status: "Planning",
    },
  });

  refreshAppPaths(project.id);

  return { ok: true, id: project.id };
}

export async function updateProject(projectId: string, values: ProjectFormValues): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the project details." };
  }

  await requireCurrentUser();
  await prisma.project.update({
    where: { id: projectId },
    data: {
      projectName: parsed.data.project_name,
      location: parsed.data.location,
      totalTargetArea: parsed.data.total_target_area,
      startDate: toDate(parsed.data.start_date),
      endDate: toDate(parsed.data.end_date),
    },
  });
  await refreshProjectRollups(projectId);
  refreshAppPaths(projectId);

  return { ok: true, id: projectId };
}

export async function createTaskHead(projectId: string, values: TaskHeadFormValues): Promise<ActionResult> {
  const parsed = taskHeadSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the task head details." };
  }

  await requireCurrentUser();
  const taskHead = await prisma.taskHead.create({
    data: {
      projectId,
      category: parsed.data.category,
      name: parsed.data.name,
      startDate: toDate(parsed.data.start_date),
      endDate: toDate(parsed.data.end_date),
    },
  });
  await refreshProjectRollups(projectId);
  refreshAppPaths(projectId);

  return { ok: true, id: taskHead.id };
}

export async function createTask(projectId: string, values: TaskFormValues): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the task setup." };
  }

  await requireCurrentUser();
  const productivityOutputs = calculateProductivityOutputs({
    outputPerHour: parsed.data.output_per_hour,
    skilledWorkers: parsed.data.skilled_workers,
    weeksPerMonth: parsed.data.weeks_per_month,
    daysPerMonth: parsed.data.days_per_month,
  });
  const task = await prisma.task.create({
    data: {
      taskHeadId: parsed.data.task_head_id,
      name: parsed.data.name,
      targetArea: parsed.data.target_area,
      unit: parsed.data.unit,
      startDate: toDate(parsed.data.start_date),
      endDate: toDate(parsed.data.end_date),
      skilledWorkers: parsed.data.skilled_workers,
      helpers: parsed.data.helpers,
      workerTrade: parsed.data.worker_trade,
      outputPerHour: parsed.data.output_per_hour,
      weeksPerMonth: parsed.data.weeks_per_month,
      daysPerMonth: parsed.data.days_per_month,
      standardOutput: productivityOutputs.dailyOutput,
      progressPercentage: 0,
      status: parsed.data.status,
    },
  });
  await refreshProjectRollups(projectId);
  refreshAppPaths(projectId);

  return { ok: true, id: task.id };
}

export async function updateTask(
  projectId: string,
  taskId: string,
  values: TaskFormValues,
): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the task setup." };
  }

  await requireCurrentUser();
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskHead: {
        select: {
          projectId: true,
        },
      },
    },
  });

  if (!existingTask || existingTask.taskHead.projectId !== projectId) {
    return { ok: false, message: "Task was not found in this project." };
  }

  const progressPercentage = calculateProgress(
    parsed.data.target_area,
    Number(existingTask.completedArea),
  );
  const productivityOutputs = calculateProductivityOutputs({
    outputPerHour: parsed.data.output_per_hour,
    skilledWorkers: parsed.data.skilled_workers,
    weeksPerMonth: parsed.data.weeks_per_month,
    daysPerMonth: parsed.data.days_per_month,
  });
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      taskHeadId: parsed.data.task_head_id,
      name: parsed.data.name,
      targetArea: parsed.data.target_area,
      unit: parsed.data.unit,
      startDate: toDate(parsed.data.start_date),
      endDate: toDate(parsed.data.end_date),
      skilledWorkers: parsed.data.skilled_workers,
      helpers: parsed.data.helpers,
      workerTrade: parsed.data.worker_trade,
      outputPerHour: parsed.data.output_per_hour,
      weeksPerMonth: parsed.data.weeks_per_month,
      daysPerMonth: parsed.data.days_per_month,
      standardOutput: productivityOutputs.dailyOutput,
      progressPercentage,
      status: parsed.data.status,
    },
  });
  await refreshProjectRollups(projectId);
  refreshAppPaths(projectId);

  return { ok: true, id: task.id };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  await requireCurrentUser();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskHead: {
        select: {
          projectId: true,
        },
      },
    },
  });

  if (!task) {
    return { ok: false, message: "Task was not found or was already deleted." };
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
  await refreshProjectRollups(task.taskHead.projectId);
  refreshAppPaths(task.taskHead.projectId);

  return { ok: true, id: taskId };
}

export async function deleteTaskHead(taskHeadId: string): Promise<ActionResult> {
  await requireCurrentUser();

  const taskHead = await prisma.taskHead.findUnique({
    where: { id: taskHeadId },
    select: {
      id: true,
      projectId: true,
    },
  });

  if (!taskHead) {
    return { ok: false, message: "Task head was not found or was already deleted." };
  }

  await prisma.taskHead.delete({
    where: { id: taskHeadId },
  });
  await refreshProjectRollups(taskHead.projectId);
  refreshAppPaths(taskHead.projectId);

  return { ok: true, id: taskHeadId };
}

export async function createProgressUpdate(values: ProgressUpdateFormValues): Promise<ActionResult> {
  const parsed = progressUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the progress update details." };
  }

  const user = await requireCurrentUserProfile();
  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    include: {
      taskHead: true,
    },
  });

  if (!task) {
    return { ok: false, message: "Selected task was not found." };
  }

  const progressPercentage = calculateProgress(Number(task.targetArea), parsed.data.actualCompletedArea);

  await prisma.progressUpdate.create({
    data: {
      taskId: task.id,
      updateType: parsed.data.updateType,
      dateCovered: toDate(parsed.data.dateCovered),
      actualCompletedArea: parsed.data.actualCompletedArea,
      remarks: parsed.data.remarks,
      updatedBy: parsed.data.updatedBy || user.name,
    },
  });
  await prisma.task.update({
    where: { id: task.id },
    data: {
      completedArea: parsed.data.actualCompletedArea,
      progressPercentage,
      status: parsed.data.status,
    },
  });
  await refreshProjectRollups(task.taskHead.projectId);
  refreshAppPaths(task.taskHead.projectId);

  return { ok: true, id: task.id };
}
