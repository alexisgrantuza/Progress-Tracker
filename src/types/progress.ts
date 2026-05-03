import type {
  ProgressUpdateRecord,
  ProjectSummary,
  TaskSummary,
  UpdateType,
} from "@/types/project";

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  tone: "default" | "good" | "warning" | "danger";
}

export interface ProductivityChartPoint {
  month: string;
  expected: number;
  actual: number;
}

export interface ProgressSnapshot {
  projectId: string;
  projectName: string;
  overallProgress: number;
  delayedTasks: number;
  criticalTasks: number;
  productivityIssues: number;
}

export interface RecentProgressUpdate extends ProgressUpdateRecord {
  task_name: string;
  project_name: string;
  progress_percentage: number;
}

export interface MonthlyReportSummary {
  id: string;
  projectId: string;
  projectName: string;
  month: string;
  summary: string;
  delayedTasks: number;
  criticalTasks: number;
  laborProductivityIssues: number;
  suggestedAction: string;
  status: string;
}

export interface ReportTaskRow {
  taskHeadName: string;
  taskName: string;
  targetArea: number;
  completedArea: number;
  progress: number;
  status: string;
}

export interface AppDataset {
  users: import("@/types/project").UserProfile[];
  projects: ProjectSummary[];
  tasks: TaskSummary[];
  progressUpdates: RecentProgressUpdate[];
  reports: MonthlyReportSummary[];
  productivityMonthly: ProductivityChartPoint[];
  snapshots: ProgressSnapshot[];
}

export interface ProgressFormValues {
  taskId: string;
  updateType: UpdateType;
  dateCovered: string;
  actualCompletedArea: number;
  remarks: string;
  updatedBy: string;
}
