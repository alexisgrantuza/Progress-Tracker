import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-6 md:py-6 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {eyebrow ? (
          <div className="flex items-center gap-2">
            <span className="inline-block h-1 w-5 rounded-full bg-slate-900" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </p>
          </div>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}
