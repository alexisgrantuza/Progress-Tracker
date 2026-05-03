import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <Icon className="size-5 text-slate-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}
