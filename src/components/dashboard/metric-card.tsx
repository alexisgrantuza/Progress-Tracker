import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const toneConfig = {
  default: {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-slate-100 text-slate-600",
    bar: "bg-slate-400",
  },
  good: {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-emerald-50 text-emerald-700",
    bar: "bg-slate-800",
  },
  warning: {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-amber-50 text-amber-700",
    bar: "bg-slate-800",
  },
  danger: {
    icon: "bg-slate-100 text-slate-600",
    badge: "bg-rose-50 text-rose-700",
    bar: "bg-slate-800",
  },
};

const barWidths = {
  default: "65%",
  good: "78%",
  warning: "52%",
  danger: "35%",
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  tone: "default" | "good" | "warning" | "danger";
}) {
  const config = toneConfig[tone];

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="font-heading text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", config.icon)}>
          <Icon className="size-5" />
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-2.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all duration-700", config.bar)}
            style={{ width: barWidths[tone] }}
          />
        </div>
        <span
          className={cn(
            "inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold",
            config.badge,
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
