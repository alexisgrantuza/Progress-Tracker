"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, ExternalLink, Filter, Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProjectDeleteButton } from "@/components/projects/project-delete-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatArea, formatDate, formatPercent } from "@/lib/utils";
import type { ProjectStatus, ProjectSummary } from "@/types/project";

const filterOptions: Array<"All" | ProjectStatus> = [
  "All",
  "Ongoing",
  "At Risk",
  "Delayed",
  "Critical",
  "Completed",
];

export function ProjectOverviewTable({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof filterOptions)[number]>("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery =
        query.length === 0 ||
        project.project_name.toLowerCase().includes(query.toLowerCase()) ||
        project.location.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  return (
    <SectionCard
      title="Project Portfolio"
      description="Search and scan project health, schedule windows, and progress rollups."
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search project or location…"
              className="w-full pl-9 text-sm sm:w-60"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as (typeof filterOptions)[number])}
          >
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="size-3.5 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects match the current filter"
          description="Try a broader search term or switch the status filter back to All."
        />
      ) : (
        <>
          {/* Mobile card view */}
          <div className="grid gap-3 md:hidden">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {project.project_name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{project.location}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarRange className="size-3.5 text-slate-400" />
                  {formatDate(project.start_date)} — {formatDate(project.end_date)}
                </div>
                <ProgressSummary
                  label="Overall progress"
                  value={project.overall_progress}
                  leftCaption={formatArea(project.total_completed_area)}
                  rightCaption={formatArea(project.total_target_area)}
                  className="mt-3"
                />
                <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link href={`/projects/${project.id}`}>
                      Open project
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                  <ProjectDeleteButton
                    projectId={project.id}
                    projectName={project.project_name}
                    taskHeadCount={project.task_heads.length}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block">
            <div className="table-wrapper rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Schedule
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400 min-w-[200px]">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="bg-white transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-4 min-w-[220px]">
                        <p className="font-semibold text-slate-900">{project.project_name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{project.location}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(project.start_date)} — {formatDate(project.end_date)}
                      </td>
                      <td className="px-4 py-4 min-w-[200px]">
                        <ProgressSummary
                          label={formatPercent(project.overall_progress)}
                          value={project.overall_progress}
                        />
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        <span className="font-medium text-slate-700">
                          {formatArea(project.total_completed_area)}
                        </span>{" "}
                        / {formatArea(project.total_target_area)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm" className="text-xs">
                            <Link href={`/projects/${project.id}`}>Open</Link>
                          </Button>
                          <ProjectDeleteButton
                            projectId={project.id}
                            projectName={project.project_name}
                            taskHeadCount={project.task_heads.length}
                            size="sm"
                            className="text-xs"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-right text-xs text-slate-400">
              {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </>
      )}
    </SectionCard>
  );
}
