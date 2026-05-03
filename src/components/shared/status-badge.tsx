import type { ComponentType } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Siren,
  TrendingDown,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProjectStatus, TaskStatus } from "@/types/project";

const statusMap: Record<
  TaskStatus | "Planning" | "Ongoing",
  {
    className: string;
    dotClass: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  Planning: {
    className: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
    icon: Clock,
  },
  Ongoing: {
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
    icon: Clock,
  },
  "On Track": {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  "At Risk": {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    icon: AlertTriangle,
  },
  Delayed: {
    className: "bg-orange-50 text-orange-700 border-orange-200",
    dotClass: "bg-orange-500",
    icon: TrendingDown,
  },
  Critical: {
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    icon: Siren,
  },
  Completed: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  "Labor Productivity Issue": {
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    icon: Wrench,
  },
};

export function StatusBadge({
  status,
  showIcon = true,
}: {
  status: TaskStatus | ProjectStatus;
  showIcon?: boolean;
}) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap",
        config.className,
      )}
    >
      {showIcon ? <Icon className="size-3" /> : <span className={cn("size-1.5 rounded-full", config.dotClass)} />}
      {status}
    </span>
  );
}
