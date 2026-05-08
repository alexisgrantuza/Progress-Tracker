import Link from "next/link";
import { FolderKanban, Gauge, Plus, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ProjectOverviewTable } from "@/components/projects/project-overview-table";
import { getAppDataset } from "@/lib/data/db-data";
import { formatPercent } from "@/lib/utils";

export default async function ProjectsPage() {
  const dataset = await getAppDataset();
  const activeProjects = dataset.projects.filter((p) => p.status !== "Completed");
  const criticalProjects = dataset.projects.filter((p) =>
    ["Critical", "Delayed", "At Risk"].includes(p.status),
  );
  const averageProgress =
    dataset.projects.length > 0
      ? dataset.projects.reduce((sum, p) => sum + p.overall_progress, 0) /
        dataset.projects.length
      : 0;

  const stats = [
    {
      icon: FolderKanban,
      label: "Active Delivery",
      sub: "Projects in execution",
      value: activeProjects.length,
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      icon: Gauge,
      label: "Portfolio Average",
      sub: "Overall completion",
      value: formatPercent(averageProgress),
      accent: "",
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      icon: TriangleAlert,
      label: "Needs Attention",
      sub: "Risk signals detected",
      value: criticalProjects.length,
      accent: "",
      iconClass: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="Project Management"
        description="Monitor project-level targets, completed area, and overall progress across every construction package."
        action={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="size-4" />
              Create project
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${stat.accent}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
                <p className="font-heading text-2xl font-bold tabular-nums text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectOverviewTable projects={dataset.projects} />
    </div>
  );
}
