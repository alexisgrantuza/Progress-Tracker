export type TaskTableFilter = "all" | "active" | "warning" | "critical";

export interface TaskHealthBreakdown {
  onTrack: number;
  atRisk: number;
  delayed: number;
  critical: number;
  completed: number;
  laborIssues: number;
}
