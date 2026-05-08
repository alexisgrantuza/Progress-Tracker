"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Calculator, Info, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressSummary } from "@/components/shared/progress-summary";
import { SectionCard } from "@/components/shared/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProgressUpdate } from "@/lib/actions";
import {
  progressUpdateSchema,
  taskStatusSchema,
  type ProgressUpdateFormInput,
  type ProgressUpdateFormValues,
} from "@/lib/validations/forms";
import { calculateProgress } from "@/lib/computations/progress";
import { formatArea, formatPercent } from "@/lib/utils";
import type { TaskSummary } from "@/types/project";

const taskStatusOptions = taskStatusSchema.options;

export function ProgressUpdateForm({ tasks }: { tasks: TaskSummary[] }) {
  const router = useRouter();
  const form = useForm<ProgressUpdateFormInput, unknown, ProgressUpdateFormValues>({
    resolver: zodResolver(progressUpdateSchema),
    defaultValues: {
      taskId: tasks[0]?.id ?? "",
      updateType: "Weekly",
      dateCovered: "2026-05-02",
      actualCompletedArea: tasks[0]?.completed_area ?? 0,
      remarks: "",
      updatedBy: "Paolo Reyes",
      status: tasks[0]?.status ?? "On Track",
    },
  });

  const taskId = useWatch({ control: form.control, name: "taskId" });
  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const actualCompletedArea = useWatch({ control: form.control, name: "actualCompletedArea" });
  const normalizedCompletedArea = Number(actualCompletedArea ?? 0);
  const selectedTask = tasks.find((t) => t.id === taskId) ?? tasks[0];
  const previewProgress = selectedTask
    ? calculateProgress(selectedTask.target_area, normalizedCompletedArea)
    : 0;

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    form.setValue("status", selectedTask.status);
  }, [form, selectedTask]);

  async function onSubmit(values: ProgressUpdateFormValues) {
    const result = await createProgressUpdate(values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      `${values.updateType} update saved. Computed progress: ${formatPercent(previewProgress)}.`,
    );
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      {/* Form card */}
      <SectionCard
        title="Progress Update Entry"
        description="Enter actual completed area only. The system computes progress percentage automatically."
        contentClassName="space-y-6"
      >
        {/* Guidance banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p>
            <span className="font-semibold">Input guidance:</span> Encode actual completed area,
            not manual percentage values. Weekly entries help spot risk early; monthly entries
            confirm critical exposure.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Task selector */}
          <div className="space-y-1.5">
            <Label htmlFor="task" className="text-sm font-semibold text-slate-700">
              Task
            </Label>
            <Select
              defaultValue={form.getValues("taskId")}
              onValueChange={(v) => form.setValue("taskId", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Update type + date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700">Update type</Label>
              <Select
                defaultValue={form.getValues("updateType")}
                onValueChange={(v) =>
                  form.setValue("updateType", v as ProgressUpdateFormValues["updateType"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateCovered" className="text-sm font-semibold text-slate-700">
                Date covered
              </Label>
              <Input id="dateCovered" type="date" {...form.register("dateCovered")} />
            </div>
          </div>

          {/* Area + updated by */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="actualCompletedArea" className="text-sm font-semibold text-slate-700">
                Actual completed area
              </Label>
              <Input
                id="actualCompletedArea"
                type="number"
                step="0.01"
                {...form.register("actualCompletedArea")}
              />
              <p className="text-xs text-slate-400">
                Enter sq.m (e.g. 100 for 100 sq.m). Do not enter a percentage.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="updatedBy" className="text-sm font-semibold text-slate-700">
                Updated by
              </Label>
              <Input id="updatedBy" {...form.register("updatedBy")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">Task status</Label>
            <Select
              value={selectedStatus ?? "On Track"}
              onValueChange={(v) =>
                form.setValue("status", v as ProgressUpdateFormValues["status"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Use this to flag At Risk, Delayed, Critical, or Labor Productivity Issue for team monitoring.
            </p>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="remarks" className="text-sm font-semibold text-slate-700">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              rows={4}
              placeholder="Add any site observations, blockers, or notes…"
              {...form.register("remarks")}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
              <Send className="size-3.5" />
              {form.formState.isSubmitting ? "Submitting..." : "Submit update"}
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Save className="size-3.5" />
              Save draft
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* Computation preview */}
      {selectedTask ? (
        <div className="space-y-4">
          <SectionCard
            title="Computation Preview"
            description="Auto-updated as you type."
            contentClassName="space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900 leading-snug">{selectedTask.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">Selected task</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Calculator className="size-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Target area</p>
                <p className="mt-1 font-bold tabular-nums text-slate-900">
                  {formatArea(selectedTask.target_area)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Input area</p>
                <p className="mt-1 font-bold tabular-nums text-slate-900">
                  {formatArea(normalizedCompletedArea)}
                </p>
              </div>
            </div>

            <ProgressSummary
              label="Computed progress"
              value={previewProgress}
              leftCaption={`Current: ${formatPercent(selectedTask.progress_percentage)}`}
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-500">
              <Info className="mt-0.5 size-3.5 shrink-0 text-orange-400" />
              <p className="leading-relaxed">
                Formula: actual completed ÷ target × 100. Preview updates as you change the completed area field.
              </p>
            </div>
          </SectionCard>
        </div>
      ) : (
        <EmptyState
          icon={Calculator}
          title="Select a task to preview"
          description="Choose a task to see the computed target-vs-actual progress preview."
        />
      )}
    </div>
  );
}
