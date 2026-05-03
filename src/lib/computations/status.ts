import { isAfter, parseISO } from "date-fns";

import { calculateProgress } from "@/lib/computations/progress";
import { computeProductivityInsight } from "@/lib/computations/productivity";
import type { TaskStatus, UpdateType } from "@/types/project";

export function classifyTaskStatus(task: {
  target_area: number;
  completed_area: number;
  start_date: string;
  end_date: string;
  skilled_workers: number;
  helpers: number;
  standard_output: number;
  latest_update_type?: UpdateType;
}) {
  const progress = calculateProgress(task.target_area, task.completed_area);
  const productivity = computeProductivityInsight({
    startDate: task.start_date,
    endDate: task.end_date,
    targetArea: task.target_area,
    completedArea: task.completed_area,
    skilledWorkers: task.skilled_workers,
    helpers: task.helpers,
    standardOutput: task.standard_output,
  });

  if (progress >= 100) {
    return "Completed" satisfies TaskStatus;
  }

  const deadlineNear = productivity.workingDaysRemaining <= 10;
  const severeGap = task.completed_area < productivity.expectedOutput * 0.7;
  const behindExpected = task.completed_area < productivity.expectedOutput;
  const behindSchedule = progress + 10 < productivity.scheduleProgress;
  const pastDue =
    isAfter(new Date(), parseISO(task.end_date)) && progress < 100;

  if (severeGap) {
    return "Labor Productivity Issue" satisfies TaskStatus;
  }

  if (
    task.latest_update_type === "Monthly" &&
    (behindSchedule || behindExpected) &&
    deadlineNear
  ) {
    return "Critical" satisfies TaskStatus;
  }

  if (pastDue || (behindSchedule && deadlineNear)) {
    return "Delayed" satisfies TaskStatus;
  }

  if (task.latest_update_type === "Weekly" && (behindExpected || behindSchedule)) {
    return "At Risk" satisfies TaskStatus;
  }

  return "On Track" satisfies TaskStatus;
}
