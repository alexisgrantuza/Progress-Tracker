"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  projectSchema,
  type ProjectFormInput,
  type ProjectFormValues,
} from "@/lib/validations/forms";

export function ProjectForm({
  defaultValues,
  mode,
}: {
  defaultValues?: Partial<ProjectFormValues>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: defaultValues?.project_name ?? "",
      location: defaultValues?.location ?? "",
      start_date: defaultValues?.start_date ?? "",
      end_date: defaultValues?.end_date ?? "",
      created_by: defaultValues?.created_by ?? "user-admin",
    },
  });

  function onSubmit(values: ProjectFormValues) {
    toast.success(
      mode === "create"
        ? `Project "${values.project_name}" prepared for Supabase save.`
        : `Project "${values.project_name}" updated in MVP demo mode.`,
    );
    router.push("/projects");
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
            <Label htmlFor="created_by">Created by</Label>
            <Input id="created_by" {...form.register("created_by")} />
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
            Total target area, total completed area, and overall progress are auto-calculated from Task Heads and Specific Tasks after they are added.
          </div>

          <div className="flex gap-3 lg:col-span-2">
            <Button type="submit">{mode === "create" ? "Create project" : "Save changes"}</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
