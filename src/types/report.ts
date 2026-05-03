import type { ProjectSummary } from "@/types/project";

export interface ReportCardProps {
  project: ProjectSummary;
  month: string;
  delayedTasks: number;
  criticalTasks: number;
  laborProductivityIssues: number;
  suggestedAction: string;
  summary: string;
}
