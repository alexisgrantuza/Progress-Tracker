import { cn, formatPercent } from "@/lib/utils";

function getProgressColor(_value: number): string {
  // Use slate for normal progress per theme guidelines.
  // Status-colored bars are handled manually where needed.
  return "bg-slate-900";
}

export function ProgressSummary({
  label,
  value,
  leftCaption,
  rightCaption,
  className,
}: {
  label: string;
  value: number;
  leftCaption?: string;
  rightCaption?: string;
  className?: string;
}) {
  const barColor = getProgressColor(value);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="tabular-nums font-bold text-slate-900">
          {formatPercent(value)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {(leftCaption || rightCaption) ? (
        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
          <span>{leftCaption}</span>
          <span>{rightCaption}</span>
        </div>
      ) : null}
    </div>
  );
}
