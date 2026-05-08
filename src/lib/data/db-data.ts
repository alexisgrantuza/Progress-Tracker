import "server-only";

import { format } from "date-fns";

import { calculateProgress, calculateTaskHeadProgress, roundToTwo } from "@/lib/computations/progress";
import { calculateProductivityOutputs, computeProductivityInsight } from "@/lib/computations/productivity";
import { prisma } from "@/lib/prisma";
import type {
  ProjectSummary,
  ProjectCategory,
  TaskHeadSummary,
  TaskSummary,
  UserProfile,
  UserRole,
  WorkerTrade,
  UpdateType,
} from "@/types/project";
import type {
  AppDataset,
  MonthlyReportSummary,
  ProductivityChartPoint,
  RecentProgressUpdate,
} from "@/types/progress";

function toDateOnly(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

function asRole(value: string): UserRole {
  if (value === "Admin" || value === "Site Engineer" || value === "QA/QC") {
    return value;
  }

  return "Supervisor";
}

function asUpdateType(value: string): UpdateType {
  return value === "Monthly" ? "Monthly" : "Weekly";
}

function asTaskStatus(value: string) {
  if (
    value === "At Risk" ||
    value === "Delayed" ||
    value === "Critical" ||
    value === "Completed" ||
    value === "Labor Productivity Issue"
  ) {
    return value;
  }

  return "On Track";
}

function asProjectCategory(value: string): ProjectCategory {
  return value === "Architectural" ? "Architectural" : "Structural";
}

function asWorkerTrade(value: string): WorkerTrade {
  if (
    value === "Carpenter" ||
    value === "Steelman" ||
    value === "Welder" ||
    value === "Painter" ||
    value === "Operator"
  ) {
    return value;
  }

  return "Mason";
}

function getTaskHeadStatus(tasks: TaskSummary[]) {
  if (tasks.length === 0) return "On Track";
  if (tasks.some((task) => task.status === "Critical")) return "Critical";
  if (tasks.some((task) => task.status === "Delayed")) return "Delayed";
  if (tasks.some((task) => task.status === "Labor Productivity Issue")) return "Labor Productivity Issue";
  if (tasks.some((task) => task.status === "At Risk")) return "At Risk";
  if (tasks.every((task) => task.status === "Completed")) return "Completed";

  return "On Track";
}

function getProjectStatus(taskHeads: TaskHeadSummary[], overallProgress: number) {
  if (overallProgress >= 100) return "Completed";
  if (taskHeads.some((head) => head.status === "Critical")) return "Critical";
  if (taskHeads.some((head) => head.status === "Delayed")) return "Delayed";
  if (taskHeads.some((head) => head.status === "At Risk")) return "At Risk";

  return "Ongoing";
}

function getSuggestedAction(project: ProjectSummary) {
  const tasks = project.task_heads.flatMap((head) => head.tasks);

  if (tasks.some((task) => task.status === "Labor Productivity Issue")) {
    return "Review worker productivity";
  }
  if (tasks.some((task) => task.status === "Critical")) {
    return "Add manpower";
  }
  if (tasks.some((task) => task.status === "Delayed")) {
    return "Adjust schedule";
  }

  return "Monitor weekly output";
}

function buildProductivityMonthly(tasks: TaskSummary[]): ProductivityChartPoint[] {
  const months = new Map<string, { expected: number; actual: number }>();

  for (const task of tasks) {
    const month = format(new Date(`${task.end_date}T00:00:00`), "MMM");
    const existing = months.get(month) ?? { expected: 0, actual: 0 };

    months.set(month, {
      expected: existing.expected + Math.min(task.productivity.expectedOutput, task.target_area),
      actual: existing.actual + task.completed_area,
    });
  }

  return Array.from(months.entries()).map(([month, values]) => ({
    month,
    expected: Math.round(values.expected * 100) / 100,
    actual: Math.round(values.actual * 100) / 100,
  }));
}

export async function getAppDataset(): Promise<AppDataset> {
  const [users, projects, progressUpdates] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.project.findMany({
      include: {
        taskHeads: {
          include: {
            tasks: {
              include: {
                progressUpdates: {
                  orderBy: [{ dateCovered: "desc" }, { createdAt: "desc" }],
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.progressUpdate.findMany({
      include: {
        task: {
          include: {
            taskHead: {
              include: {
                project: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const userProfiles: UserProfile[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: asRole(user.role),
    created_at: user.createdAt.toISOString(),
  }));

  const projectSummaries: ProjectSummary[] = projects.map((project) => {
    const taskHeads = project.taskHeads.map<TaskHeadSummary>((head) => {
      const tasks = head.tasks.map<TaskSummary>((task) => {
        const latestUpdate = task.progressUpdates[0];
        const taskRecord = {
          id: task.id,
          task_head_id: task.taskHeadId,
          name: task.name,
          target_area: toNumber(task.targetArea),
          unit: task.unit,
          completed_area: toNumber(task.completedArea),
          start_date: toDateOnly(task.startDate),
          end_date: toDateOnly(task.endDate),
          skilled_workers: task.skilledWorkers,
          helpers: task.helpers,
          worker_trade: asWorkerTrade(task.workerTrade),
          output_per_hour: toNumber(task.outputPerHour),
          weeks_per_month: toNumber(task.weeksPerMonth),
          days_per_month: task.daysPerMonth,
          standard_output: toNumber(task.standardOutput),
          created_at: task.createdAt.toISOString(),
        };
        const outputs = calculateProductivityOutputs({
          outputPerHour: taskRecord.output_per_hour,
          skilledWorkers: taskRecord.skilled_workers,
          weeksPerMonth: taskRecord.weeks_per_month,
          daysPerMonth: taskRecord.days_per_month,
        });
        const productivity = computeProductivityInsight({
          startDate: taskRecord.start_date,
          endDate: taskRecord.end_date,
          targetArea: taskRecord.target_area,
          completedArea: taskRecord.completed_area,
          skilledWorkers: taskRecord.skilled_workers,
          helpers: taskRecord.helpers,
          standardOutput: taskRecord.standard_output,
        });
        const progress_percentage = calculateProgress(taskRecord.target_area, taskRecord.completed_area);
        const status = asTaskStatus(task.status);

        return {
          ...taskRecord,
          daily_output: outputs.dailyOutput,
          weekly_output: outputs.weeklyOutput,
          monthly_output_by_weeks: outputs.monthlyOutputByWeeks,
          monthly_output_by_days: outputs.monthlyOutputByDays,
          latest_update_type: latestUpdate ? asUpdateType(latestUpdate.updateType) : undefined,
          latest_update_date: latestUpdate ? toDateOnly(latestUpdate.dateCovered) : undefined,
          productivity,
          progress_percentage,
          status,
        };
      });
      const progress = calculateTaskHeadProgress(tasks);

      return {
        id: head.id,
        project_id: head.projectId,
        category: asProjectCategory(head.category),
        name: head.name,
        start_date: toDateOnly(head.startDate),
        end_date: toDateOnly(head.endDate),
        created_at: head.createdAt.toISOString(),
        target_area: progress.totalTargetArea,
        completed_area: progress.totalCompletedArea,
        progress_percentage: progress.progressPercentage,
        status: getTaskHeadStatus(tasks),
        tasks,
      };
    });
    const fixedProjectArea = toNumber(project.totalTargetArea);
    const scopedTaskHeadArea = roundToTwo(
      taskHeads.reduce((sum, head) => sum + head.target_area, 0),
    );
    const totalCompletedArea = roundToTwo(
      taskHeads.reduce((sum, head) => sum + head.completed_area, 0),
    );
    const overallProgress = calculateProgress(scopedTaskHeadArea, totalCompletedArea);

    return {
      id: project.id,
      project_name: project.projectName,
      location: project.location,
      start_date: toDateOnly(project.startDate),
      end_date: toDateOnly(project.endDate),
      created_by: project.createdById ?? "",
      created_at: project.createdAt.toISOString(),
      total_target_area: fixedProjectArea,
      total_completed_area: totalCompletedArea,
      overall_progress: overallProgress,
      status: getProjectStatus(taskHeads, overallProgress),
      task_heads: taskHeads,
    };
  });

  const tasks = projectSummaries.flatMap((project) =>
    project.task_heads.flatMap((head) => head.tasks),
  );
  const recentUpdates: RecentProgressUpdate[] = progressUpdates.map((update) => ({
    id: update.id,
    task_id: update.taskId,
    update_type: asUpdateType(update.updateType),
    date_covered: toDateOnly(update.dateCovered),
    actual_completed_area: toNumber(update.actualCompletedArea),
    remarks: update.remarks ?? "",
    updated_by: update.updatedBy,
    created_at: update.createdAt.toISOString(),
    task_name: update.task.name,
    project_name: update.task.taskHead.project.projectName,
    progress_percentage: calculateProgress(
      toNumber(update.task.targetArea),
      toNumber(update.actualCompletedArea),
    ),
  }));
  const reports: MonthlyReportSummary[] = projectSummaries.map((project) => {
    const taskRows = project.task_heads.flatMap((head) => head.tasks);
    const delayedTasks = taskRows.filter((task) => task.status === "Delayed").length;
    const criticalTasks = taskRows.filter((task) => task.status === "Critical").length;
    const laborProductivityIssues = taskRows.filter(
      (task) => task.status === "Labor Productivity Issue",
    ).length;

    return {
      id: `report-${project.id}`,
      projectId: project.id,
      projectName: project.project_name,
      month: format(new Date(), "MMMM yyyy"),
      summary: `${project.project_name} is ${project.overall_progress}% complete with ${taskRows.length} tracked specific tasks.`,
      delayedTasks,
      criticalTasks,
      laborProductivityIssues,
      suggestedAction: getSuggestedAction(project),
      status: project.status,
    };
  });

  return {
    users: userProfiles,
    projects: projectSummaries,
    tasks,
    progressUpdates: recentUpdates,
    reports,
    productivityMonthly: buildProductivityMonthly(tasks),
    snapshots: projectSummaries.map((project) => {
      const taskRows = project.task_heads.flatMap((head) => head.tasks);

      return {
        projectId: project.id,
        projectName: project.project_name,
        overallProgress: project.overall_progress,
        delayedTasks: taskRows.filter((task) => task.status === "Delayed").length,
        criticalTasks: taskRows.filter((task) => task.status === "Critical").length,
        productivityIssues: taskRows.filter((task) => task.status === "Labor Productivity Issue").length,
      };
    }),
  };
}

export async function getProjectById(projectId: string) {
  const dataset = await getAppDataset();

  return dataset.projects.find((project) => project.id === projectId) ?? null;
}

export async function getProjectRows(projectId: string) {
  const project = await getProjectById(projectId);

  if (!project) {
    return [];
  }

  return project.task_heads.flatMap((head) =>
    head.tasks.map((task) => ({
      taskHeadName: head.name,
      taskName: task.name,
      targetArea: task.target_area,
      completedArea: task.completed_area,
      progress: task.progress_percentage,
      status: task.status,
    })),
  );
}
