import { format, parseISO } from "date-fns";

import { calculateProjectProgress, calculateTaskHeadProgress } from "@/lib/computations/progress";
import { calculateProductivityOutputs, computeProductivityInsight } from "@/lib/computations/productivity";
import { classifyTaskStatus } from "@/lib/computations/status";
import type {
  ProgressUpdateRecord,
  ProjectRecord,
  ProjectSummary,
  TaskHeadRecord,
  TaskHeadSummary,
  TaskRecord,
  TaskSummary,
  UserProfile,
} from "@/types/project";
import type {
  AppDataset,
  MonthlyReportSummary,
  ProductivityChartPoint,
  RecentProgressUpdate,
} from "@/types/progress";

const users: UserProfile[] = [
  {
    id: "user-admin",
    name: "Maria Santos",
    email: "maria@tracker.local",
    role: "Admin",
    created_at: "2026-01-02T08:00:00.000Z",
  },
  {
    id: "user-supervisor",
    name: "Paolo Reyes",
    email: "paolo@tracker.local",
    role: "Supervisor",
    created_at: "2026-01-02T08:15:00.000Z",
  },
  {
    id: "user-engineer",
    name: "Ivy Mendoza",
    email: "ivy@tracker.local",
    role: "Site Engineer",
    created_at: "2026-01-02T08:20:00.000Z",
  },
];

const projects: ProjectRecord[] = [
  {
    id: "project-1",
    project_name: "Sample Residential Construction",
    location: "Laguna",
    start_date: "2026-01-01",
    end_date: "2026-03-31",
    created_by: "user-admin",
    created_at: "2026-01-01T08:00:00.000Z",
  },
  {
    id: "project-2",
    project_name: "South Tower Retrofit",
    location: "Makati",
    start_date: "2026-02-01",
    end_date: "2026-06-30",
    created_by: "user-engineer",
    created_at: "2026-02-01T07:30:00.000Z",
  },
  {
    id: "project-3",
    project_name: "Warehouse Expansion Phase 1",
    location: "Batangas",
    start_date: "2025-11-01",
    end_date: "2026-02-28",
    created_by: "user-supervisor",
    created_at: "2025-11-01T07:30:00.000Z",
  },
];

const taskHeads: TaskHeadRecord[] = [
  {
    id: "head-1",
    project_id: "project-1",
    category: "Structural",
    name: "Installation of Walls",
    start_date: "2026-01-01",
    end_date: "2026-03-31",
    created_at: "2026-01-01T08:30:00.000Z",
  },
  {
    id: "head-2",
    project_id: "project-1",
    category: "Structural",
    name: "Electrical Works",
    start_date: "2026-01-15",
    end_date: "2026-03-20",
    created_at: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "head-3",
    project_id: "project-2",
    category: "Architectural",
    name: "Finishing Works",
    start_date: "2026-02-10",
    end_date: "2026-06-15",
    created_at: "2026-02-01T08:00:00.000Z",
  },
  {
    id: "head-4",
    project_id: "project-3",
    category: "Structural",
    name: "Plumbing Works",
    start_date: "2025-11-01",
    end_date: "2026-02-15",
    created_at: "2025-11-01T08:00:00.000Z",
  },
];

type SampleTaskRecord = Omit<
  TaskRecord,
  | "worker_trade"
  | "output_per_hour"
  | "daily_output"
  | "weekly_output"
  | "monthly_output_by_weeks"
  | "monthly_output_by_days"
  | "weeks_per_month"
  | "days_per_month"
>;

const sampleTasks: SampleTaskRecord[] = [
  {
    id: "task-1",
    task_head_id: "head-1",
    name: "CHB Laying",
    target_area: 120,
    unit: "sq.m",
    completed_area: 60,
    start_date: "2026-01-01",
    end_date: "2026-03-31",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 10,
    created_at: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "task-2",
    task_head_id: "head-1",
    name: "Plastering",
    target_area: 80,
    unit: "sq.m",
    completed_area: 20,
    start_date: "2026-01-10",
    end_date: "2026-03-31",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 8,
    created_at: "2026-01-01T10:30:00.000Z",
  },
  {
    id: "task-3",
    task_head_id: "head-1",
    name: "Finishing",
    target_area: 50,
    unit: "sq.m",
    completed_area: 5,
    start_date: "2026-02-01",
    end_date: "2026-03-31",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 6,
    created_at: "2026-01-01T11:00:00.000Z",
  },
  {
    id: "task-4",
    task_head_id: "head-2",
    name: "Conduit Rough-in",
    target_area: 90,
    unit: "sq.m",
    completed_area: 55,
    start_date: "2026-01-15",
    end_date: "2026-03-10",
    skilled_workers: 2,
    helpers: 4,
    standard_output: 12,
    created_at: "2026-01-02T08:00:00.000Z",
  },
  {
    id: "task-5",
    task_head_id: "head-2",
    name: "Fixture Installation",
    target_area: 40,
    unit: "sq.m",
    completed_area: 12,
    start_date: "2026-02-10",
    end_date: "2026-03-20",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 5,
    created_at: "2026-01-02T08:30:00.000Z",
  },
  {
    id: "task-6",
    task_head_id: "head-3",
    name: "Drywall Skim Coat",
    target_area: 180,
    unit: "sq.m",
    completed_area: 110,
    start_date: "2026-02-10",
    end_date: "2026-05-20",
    skilled_workers: 2,
    helpers: 4,
    standard_output: 14,
    created_at: "2026-02-03T08:00:00.000Z",
  },
  {
    id: "task-7",
    task_head_id: "head-3",
    name: "Painting",
    target_area: 140,
    unit: "sq.m",
    completed_area: 36,
    start_date: "2026-03-01",
    end_date: "2026-06-15",
    skilled_workers: 2,
    helpers: 4,
    standard_output: 11,
    created_at: "2026-02-03T08:10:00.000Z",
  },
  {
    id: "task-8",
    task_head_id: "head-4",
    name: "Pipe Rack Installation",
    target_area: 95,
    unit: "sq.m",
    completed_area: 95,
    start_date: "2025-11-01",
    end_date: "2026-01-31",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 9,
    created_at: "2025-11-03T08:00:00.000Z",
  },
  {
    id: "task-9",
    task_head_id: "head-4",
    name: "Pressure Testing",
    target_area: 30,
    unit: "sq.m",
    completed_area: 30,
    start_date: "2026-01-15",
    end_date: "2026-02-15",
    skilled_workers: 1,
    helpers: 2,
    standard_output: 4,
    created_at: "2025-11-03T08:20:00.000Z",
  },
];

const tasks: TaskRecord[] = sampleTasks.map((task) => {
  const outputPerHour = task.standard_output / Math.max(task.skilled_workers * 8, 1);
  const outputs = calculateProductivityOutputs({
    outputPerHour,
    skilledWorkers: task.skilled_workers,
  });

  return {
    ...task,
    worker_trade: task.name.toLowerCase().includes("paint") ? "Painter" : "Mason",
    output_per_hour: Number(outputPerHour.toFixed(4)),
    daily_output: outputs.dailyOutput,
    weekly_output: outputs.weeklyOutput,
    monthly_output_by_weeks: outputs.monthlyOutputByWeeks,
    monthly_output_by_days: outputs.monthlyOutputByDays,
    weeks_per_month: 4,
    days_per_month: 20,
  };
});

const progressUpdates: ProgressUpdateRecord[] = [
  {
    id: "update-1",
    task_id: "task-1",
    update_type: "Weekly",
    date_covered: "2026-03-28",
    actual_completed_area: 60,
    remarks: "CHB crew stable but pace is flattening.",
    updated_by: "Paolo Reyes",
    created_at: "2026-03-28T16:00:00.000Z",
  },
  {
    id: "update-2",
    task_id: "task-2",
    update_type: "Monthly",
    date_covered: "2026-03-31",
    actual_completed_area: 20,
    remarks: "Wet areas delayed due to rework and curing time.",
    updated_by: "Ivy Mendoza",
    created_at: "2026-03-31T18:00:00.000Z",
  },
  {
    id: "update-3",
    task_id: "task-5",
    update_type: "Weekly",
    date_covered: "2026-03-15",
    actual_completed_area: 12,
    remarks: "Fixture material delivered late.",
    updated_by: "Paolo Reyes",
    created_at: "2026-03-15T15:10:00.000Z",
  },
  {
    id: "update-4",
    task_id: "task-6",
    update_type: "Monthly",
    date_covered: "2026-04-30",
    actual_completed_area: 110,
    remarks: "Crew recovered after additional manpower.",
    updated_by: "Maria Santos",
    created_at: "2026-04-30T17:20:00.000Z",
  },
  {
    id: "update-5",
    task_id: "task-7",
    update_type: "Weekly",
    date_covered: "2026-04-25",
    actual_completed_area: 36,
    remarks: "Painting crew productivity below target.",
    updated_by: "Ivy Mendoza",
    created_at: "2026-04-25T17:20:00.000Z",
  },
];

function getLatestUpdate(taskId: string) {
  return progressUpdates
    .filter((update) => update.task_id === taskId)
    .sort((a, b) => (a.date_covered < b.date_covered ? 1 : -1))[0];
}

function buildTaskSummaries() {
  return tasks.map<TaskSummary>((task) => {
    const latestUpdate = getLatestUpdate(task.id);
    const productivity = computeProductivityInsight({
      startDate: task.start_date,
      endDate: task.end_date,
      targetArea: task.target_area,
      completedArea: task.completed_area,
      skilledWorkers: task.skilled_workers,
      helpers: task.helpers,
      standardOutput: task.standard_output,
      today: parseISO("2026-05-02"),
    });
    const progress_percentage = Number(
      ((task.completed_area / task.target_area) * 100).toFixed(2),
    );
    const status = classifyTaskStatus({
      ...task,
      latest_update_type: latestUpdate?.update_type,
    });

    return {
      ...task,
      latest_update_type: latestUpdate?.update_type,
      latest_update_date: latestUpdate?.date_covered,
      progress_percentage,
      status,
      productivity,
    };
  });
}

function buildTaskHeadSummaries(taskSummaries: TaskSummary[]) {
  return taskHeads.map<TaskHeadSummary>((head) => {
    const relatedTasks = taskSummaries.filter((task) => task.task_head_id === head.id);
    const progress = calculateTaskHeadProgress(relatedTasks);
    const status =
      relatedTasks.some((task) => task.status === "Critical")
        ? "Critical"
        : relatedTasks.some((task) => task.status === "Delayed")
          ? "Delayed"
          : relatedTasks.some((task) => task.status === "Labor Productivity Issue")
            ? "Labor Productivity Issue"
            : relatedTasks.some((task) => task.status === "At Risk")
              ? "At Risk"
              : relatedTasks.every((task) => task.status === "Completed")
                ? "Completed"
                : "On Track";

    return {
      ...head,
      target_area: progress.totalTargetArea,
      completed_area: progress.totalCompletedArea,
      progress_percentage: progress.progressPercentage,
      status,
      tasks: relatedTasks,
    };
  });
}

function buildProjectSummaries(taskHeadSummaries: TaskHeadSummary[]) {
  return projects.map<ProjectSummary>((project) => {
    const relatedHeads = taskHeadSummaries.filter(
      (head) => head.project_id === project.id,
    );
    const progress = calculateProjectProgress(relatedHeads);
    const status =
      progress.overallProgress >= 100
        ? "Completed"
        : relatedHeads.some((head) => head.status === "Critical")
          ? "Critical"
          : relatedHeads.some((head) => head.status === "Delayed")
            ? "Delayed"
            : relatedHeads.some((head) => head.status === "At Risk")
              ? "At Risk"
              : "Ongoing";

    return {
      ...project,
      total_target_area: progress.totalTargetArea,
      total_completed_area: progress.totalCompletedArea,
      overall_progress: progress.overallProgress,
      status,
      task_heads: relatedHeads,
    };
  });
}

function buildRecentUpdates(
  taskSummaries: TaskSummary[],
  projectSummaries: ProjectSummary[],
) {
  return progressUpdates
    .map<RecentProgressUpdate>((update) => {
      const task = taskSummaries.find((item) => item.id === update.task_id)!;
      const taskHead = taskHeads.find((head) => head.id === task.task_head_id)!;
      const project = projectSummaries.find(
        (item) => item.id === taskHead.project_id,
      )!;

      return {
        ...update,
        task_name: task.name,
        project_name: project.project_name,
        progress_percentage: task.progress_percentage,
      };
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

function buildProductivityMonthly(taskSummaries: TaskSummary[]): ProductivityChartPoint[] {
  return [
    { month: "Jan", expected: 140, actual: 120 },
    { month: "Feb", expected: 180, actual: 150 },
    { month: "Mar", expected: 220, actual: 170 },
    { month: "Apr", expected: 260, actual: 215 },
    {
      month: "May",
      expected: taskSummaries.reduce(
        (sum, task) => sum + Math.min(task.productivity.expectedOutput, task.target_area),
        0,
      ),
      actual: taskSummaries.reduce((sum, task) => sum + task.completed_area, 0),
    },
  ];
}

function getSuggestedAction(project: ProjectSummary) {
  const allTasks = project.task_heads.flatMap((head) => head.tasks);

  if (allTasks.some((task) => task.status === "Labor Productivity Issue")) {
    return "Review worker productivity";
  }
  if (allTasks.some((task) => task.status === "Critical")) {
    return "Add manpower";
  }
  if (allTasks.some((task) => task.status === "Delayed")) {
    return "Adjust schedule";
  }

  return "Monitor weekly output";
}

function buildReports(projectSummaries: ProjectSummary[]): MonthlyReportSummary[] {
  return projectSummaries.map((project) => {
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
      month: format(parseISO("2026-05-01"), "MMMM yyyy"),
      summary: `${project.project_name} is ${project.overall_progress}% complete with ${taskRows.length} tracked specific tasks.`,
      delayedTasks,
      criticalTasks,
      laborProductivityIssues,
      suggestedAction: getSuggestedAction(project),
      status: project.status,
    };
  });
}

export function getAppDataset(): AppDataset {
  const taskSummaries = buildTaskSummaries();
  const taskHeadSummaries = buildTaskHeadSummaries(taskSummaries);
  const projectSummaries = buildProjectSummaries(taskHeadSummaries);
  const recentUpdates = buildRecentUpdates(taskSummaries, projectSummaries);
  const reports = buildReports(projectSummaries);

  return {
    users,
    projects: projectSummaries,
    tasks: taskSummaries,
    progressUpdates: recentUpdates,
    reports,
    productivityMonthly: buildProductivityMonthly(taskSummaries),
    snapshots: projectSummaries.map((project) => {
      const allTasks = project.task_heads.flatMap((head) => head.tasks);

      return {
        projectId: project.id,
        projectName: project.project_name,
        overallProgress: project.overall_progress,
        delayedTasks: allTasks.filter((task) => task.status === "Delayed").length,
        criticalTasks: allTasks.filter((task) => task.status === "Critical").length,
        productivityIssues: allTasks.filter(
          (task) => task.status === "Labor Productivity Issue",
        ).length,
      };
    }),
  };
}

export function getProjectById(projectId: string) {
  return getAppDataset().projects.find((project) => project.id === projectId) ?? null;
}

export function getProjectRows(projectId: string) {
  const project = getProjectById(projectId);

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
