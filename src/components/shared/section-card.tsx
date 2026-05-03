import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 md:px-6">
        <div className="space-y-1 min-w-0">
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-sm leading-relaxed text-slate-500">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={cn("p-5 md:p-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
