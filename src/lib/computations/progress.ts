import type { TaskHeadSummary, TaskSummary } from "@/types/project";

export function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateProgress(targetArea: number, completedArea: number) {
  if (targetArea <= 0) return 0;

  return Math.min(100, roundToTwo((completedArea / targetArea) * 100));
}

export function calculateTaskHeadProgress(tasks: TaskSummary[]) {
  const targetArea = tasks.reduce((sum, task) => sum + task.target_area, 0);
  const completedArea = tasks.reduce(
    (sum, task) => sum + task.completed_area,
    0,
  );

  return {
    totalCompletedArea: roundToTwo(completedArea),
    totalTargetArea: roundToTwo(targetArea),
    progressPercentage: calculateProgress(targetArea, completedArea),
  };
}

export function calculateProjectProgress(taskHeads: TaskHeadSummary[]) {
  const totalTargetArea = taskHeads.reduce(
    (sum, head) => sum + head.target_area,
    0,
  );
  const totalCompletedArea = taskHeads.reduce(
    (sum, head) => sum + head.completed_area,
    0,
  );

  return {
    totalTargetArea: roundToTwo(totalTargetArea),
    totalCompletedArea: roundToTwo(totalCompletedArea),
    overallProgress: calculateProgress(totalTargetArea, totalCompletedArea),
  };
}
