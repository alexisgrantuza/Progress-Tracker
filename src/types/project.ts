export type UserRole = "Admin" | "Supervisor" | "Site Engineer" | "QA/QC";

export type UpdateType = "Weekly" | "Monthly";

export type TaskStatus =
  | "On Track"
  | "At Risk"
  | "Delayed"
  | "Critical"
  | "Completed"
  | "Labor Productivity Issue";

export type ProjectStatus =
  | TaskStatus
  | "Planning"
  | "Ongoing";

export type ProjectCategory = "Structural" | "Architectural";

export type WorkerTrade =
  | "Carpenter"
  | "Mason"
  | "Steelman"
  | "Welder"
  | "Painter"
  | "Operator";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ProjectRecord {
  id: string;
  project_name: string;
  location: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
}

export interface TaskHeadRecord {
  id: string;
  project_id: string;
  category: ProjectCategory;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface TaskRecord {
  id: string;
  task_head_id: string;
  name: string;
  target_area: number;
  unit: string;
  completed_area: number;
  start_date: string;
  end_date: string;
  skilled_workers: number;
  helpers: number;
  worker_trade: WorkerTrade;
  output_per_hour: number;
  daily_output: number;
  weekly_output: number;
  monthly_output_by_weeks: number;
  monthly_output_by_days: number;
  weeks_per_month: number;
  days_per_month: number;
  standard_output: number;
  created_at: string;
}

export interface ProgressUpdateRecord {
  id: string;
  task_id: string;
  update_type: UpdateType;
  date_covered: string;
  actual_completed_area: number;
  remarks: string;
  updated_by: string;
  created_at: string;
}

export interface ProductivityStandardRecord {
  id: string;
  task_type: string;
  skilled_workers: number;
  helpers: number;
  standard_output: number;
  unit: string;
  created_at: string;
}

export interface ProductivityInsight {
  workerSets: number;
  workingDaysElapsed: number;
  workingDaysRemaining: number;
  expectedOutput: number;
  outputVariance: number;
  remainingArea: number;
  scheduleProgress: number;
}

export interface TaskSummary extends TaskRecord {
  progress_percentage: number;
  status: TaskStatus;
  latest_update_type?: UpdateType;
  latest_update_date?: string;
  productivity: ProductivityInsight;
}

export interface TaskHeadSummary extends TaskHeadRecord {
  target_area: number;
  completed_area: number;
  progress_percentage: number;
  status: TaskStatus;
  tasks: TaskSummary[];
}

export interface ProjectSummary extends ProjectRecord {
  total_target_area: number;
  total_completed_area: number;
  overall_progress: number;
  status: ProjectStatus;
  task_heads: TaskHeadSummary[];
}
