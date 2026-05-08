"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProject, updateProject } from "@/lib/actions";
import {
  projectSchema,
  type ProjectFormInput,
  type ProjectFormValues,
} from "@/lib/validations/forms";

export function ProjectForm({
  defaultValues,
  mode,
  projectId,
}: {
  defaultValues?: Partial<ProjectFormValues>;
  mode: "create" | "edit";
  projectId?: string;
}) {
  const router = useRouter();
  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: defaultValues?.project_name ?? "",
      location: defaultValues?.location ?? "",
      total_target_area: defaultValues?.total_target_area ?? 0,
      start_date: defaultValues?.start_date ?? "",
      end_date: defaultValues?.end_date ?? "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    const result =
      mode === "create"
        ? await createProject(values)
        : projectId
          ? await updateProject(projectId, values)
          : { ok: false as const, message: "Project id is missing." };

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      mode === "create"
        ? `Project "${values.project_name}" created.`
        : `Project "${values.project_name}" updated.`,
    );
    router.push(result.id ? `/projects/${result.id}` : "/projects");
    router.refresh();
  }

  return (
    <Card className="border-0 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="project_name">Project name</Label>
            <Input id="project_name" {...form.register("project_name")} />
            <p className="text-xs text-rose-600">{form.formState.errors.project_name?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} />
            <p className="text-xs text-rose-600">{form.formState.errors.location?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_target_area">Project area</Label>
            <Input
              id="total_target_area"
              type="number"
              step="0.01"
              {...form.register("total_target_area")}
            />
            <p className="text-xs text-rose-600">{form.formState.errors.total_target_area?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" type="date" {...form.register("start_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" type="date" {...form.register("end_date")} />
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 lg:col-span-2">
            Project area is the fixed baseline for overall progress. Task heads and specific tasks update completed area and progress, but they do not increase this project area.
          </div>

          <div className="flex gap-3 lg:col-span-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create project"
                  : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
