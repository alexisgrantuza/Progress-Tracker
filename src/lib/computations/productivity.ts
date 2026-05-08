import {
  differenceInCalendarDays,
  eachDayOfInterval,
  isWeekend,
  parseISO,
} from "date-fns";

export function getWorkerSets(skilledWorkers: number, helpers: number) {
  return Math.max(0, Math.min(skilledWorkers, Math.floor(helpers / 2)));
}

export function getWorkingDaysBetween(startDate: string, endDate: string) {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  return days.filter((day) => !isWeekend(day)).length;
}

export function calculateExpectedOutput(
  standardOutput: number,
  skilledWorkers: number,
  helpersOrWorkingDays: number,
  maybeWorkingDays?: number,
) {
  const workerSets =
    typeof maybeWorkingDays === "number"
      ? getWorkerSets(skilledWorkers, helpersOrWorkingDays)
      : skilledWorkers;
  const workingDays =
    typeof maybeWorkingDays === "number"
      ? maybeWorkingDays
      : helpersOrWorkingDays;

  return standardOutput * workerSets * Math.max(workingDays, 0);
}

export function calculateProductivityOutputs(input: {
  outputPerHour: number;
  skilledWorkers?: number;
  supervisorWorkers?: number;
  foremanWorkers?: number;
  carpenterWorkers?: number;
  masonWorkers?: number;
  steelmanWorkers?: number;
  welderWorkers?: number;
  painterWorkers?: number;
  operatorWorkers?: number;
  helpers?: number;
  hoursPerDay?: number;
  workingDaysPerWeek?: number;
  weeksPerMonth?: number;
  daysPerMonth?: number;
}) {
  const totalSkilledWorkers =
    input.skilledWorkers ??
    (input.supervisorWorkers ?? 0) +
      (input.foremanWorkers ?? 0) +
      (input.carpenterWorkers ?? 0) +
      (input.masonWorkers ?? 0) +
      (input.steelmanWorkers ?? 0) +
      (input.welderWorkers ?? 0) +
      (input.painterWorkers ?? 0) +
      (input.operatorWorkers ?? 0);
  const helpers = input.helpers ?? 0;
  const hoursPerDay = input.hoursPerDay ?? 8;
  const workingDaysPerWeek = input.workingDaysPerWeek ?? 5;
  const weeksPerMonth = input.weeksPerMonth ?? 4;
  const daysPerMonth = input.daysPerMonth ?? 20;
  const dailySkilledOutput = input.outputPerHour * hoursPerDay * totalSkilledWorkers;
  const dailyLaborOutput = helpers > 0 ? dailySkilledOutput / helpers : 0;
  const weeklySkilledOutput = dailySkilledOutput * workingDaysPerWeek;
  const weeklyLaborOutput = dailyLaborOutput * workingDaysPerWeek;
  const monthlySkilledOutput = weeklySkilledOutput * weeksPerMonth;
  const monthlyLaborOutput = weeklyLaborOutput * weeksPerMonth;
  const monthlySkilledOutputByDays = dailySkilledOutput * daysPerMonth;
  const monthlyLaborOutputByDays = dailyLaborOutput * daysPerMonth;

  const round = (value: number) => Math.round(value * 100) / 100;

  return {
    totalSkilledWorkers,
    totalWorkers: totalSkilledWorkers + helpers,
    dailyOutput: round(dailySkilledOutput),
    weeklyOutput: round(weeklySkilledOutput),
    monthlyOutputByWeeks: round(monthlySkilledOutput),
    monthlyOutputByDays: round(monthlySkilledOutputByDays),
    dailySkilledOutput: round(dailySkilledOutput),
    dailyLaborOutput: round(dailyLaborOutput),
    weeklySkilledOutput: round(weeklySkilledOutput),
    weeklyLaborOutput: round(weeklyLaborOutput),
    monthlySkilledOutput: round(monthlySkilledOutput),
    monthlyLaborOutput: round(monthlyLaborOutput),
    monthlySkilledOutputByDays: round(monthlySkilledOutputByDays),
    monthlyLaborOutputByDays: round(monthlyLaborOutputByDays),
  };
}

export function computeProductivityInsight(input: {
  startDate: string;
  endDate: string;
  targetArea: number;
  completedArea: number;
  skilledWorkers: number;
  helpers: number;
  standardOutput: number;
  today?: Date;
}) {
  const today = input.today ?? new Date();
  const end = parseISO(input.endDate);
  const totalWorkingDays = getWorkingDaysBetween(input.startDate, input.endDate);
  const elapsedCalendarDays = Math.max(
    0,
    differenceInCalendarDays(today, parseISO(input.startDate)) + 1,
  );
  const estimatedElapsedEnd = new Date(
    Math.min(today.getTime(), end.getTime()),
  ).toISOString();
  const workingDaysElapsed = Math.min(
    totalWorkingDays,
    getWorkingDaysBetween(input.startDate, estimatedElapsedEnd),
  );
  const workingDaysRemaining = Math.max(totalWorkingDays - workingDaysElapsed, 0);
  const workerSets = getWorkerSets(input.skilledWorkers, input.helpers);
  const expectedOutput = calculateExpectedOutput(
    input.standardOutput,
    workerSets,
    workingDaysElapsed,
  );
  const remainingArea = Math.max(input.targetArea - input.completedArea, 0);
  const outputVariance = input.completedArea - expectedOutput;
  const totalCalendarDays =
    Math.max(
      1,
      differenceInCalendarDays(parseISO(input.endDate), parseISO(input.startDate)) +
        1,
    );
  const scheduleProgress = Math.min(
    100,
    Math.max(0, (elapsedCalendarDays / totalCalendarDays) * 100),
  );

  return {
    workerSets,
    workingDaysElapsed,
    workingDaysRemaining,
    expectedOutput: Math.round(expectedOutput * 100) / 100,
    outputVariance: Math.round(outputVariance * 100) / 100,
    remainingArea: Math.round(remainingArea * 100) / 100,
    scheduleProgress: Math.round(scheduleProgress * 100) / 100,
  };
}
