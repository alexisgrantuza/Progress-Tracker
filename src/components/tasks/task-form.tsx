"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask, updateTask } from "@/lib/actions";
import { calculateProductivityOutputs } from "@/lib/computations/productivity";
import {
  taskSchema,
  taskStatusSchema,
  workerTradeSchema,
  type TaskFormInput,
  type TaskFormValues,
} from "@/lib/validations/forms";
import type { TaskHeadSummary } from "@/types/project";

const taskStatusOptions = taskStatusSchema.options;
const workerTradeOptions = workerTradeSchema.options;

export function TaskForm({
  projectId,
  taskHeads,
  mode = "create",
  taskId,
  defaultValues,
}: {
  projectId: string;
  taskHeads: TaskHeadSummary[];
  mode?: "create" | "edit";
  taskId?: string;
  defaultValues?: TaskFormInput;
}) {
  const router = useRouter();
  const form = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ?? {
      task_head_id: taskHeads[0]?.id ?? "",
      name: "",
      target_area: 0,
      unit: "sq.m",
      start_date: "",
      end_date: "",
      skilled_workers: 1,
      helpers: 2,
      worker_trade: "Mason",
      output_per_hour: 0,
      weeks_per_month: 4,
      days_per_month: 20,
      standard_output: 0,
      status: "On Track",
    },
  });
  const outputPerHour = Number(useWatch({ control: form.control, name: "output_per_hour" }) ?? 0);
  const skilledWorkers = Number(useWatch({ control: form.control, name: "skilled_workers" }) ?? 0);
  const weeksPerMonth = Number(useWatch({ control: form.control, name: "weeks_per_month" }) ?? 4);
  const daysPerMonth = Number(useWatch({ control: form.control, name: "days_per_month" }) ?? 20);
  const productivityOutputs = calculateProductivityOutputs({
    outputPerHour,
    skilledWorkers,
    weeksPerMonth,
    daysPerMonth,
  });

  async function onSubmit(values: TaskFormValues) {
    const result =
      mode === "edit" && taskId
        ? await updateTask(projectId, taskId, values)
        : await createTask(projectId, values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`Task "${values.name}" ${mode === "edit" ? "updated" : "created"}.`);

    if (mode === "edit") {
      router.push(`/projects/${projectId}`);
      router.refresh();
      return;
    }

    form.reset({
      task_head_id: values.task_head_id,
      name: "",
      target_area: 0,
      unit: "sq.m",
      start_date: "",
      end_date: "",
      skilled_workers: 1,
      helpers: 2,
      worker_trade: "Mason",
      output_per_hour: 0,
      weeks_per_month: 4,
      days_per_month: 20,
      standard_output: 0,
      status: "On Track",
    });
    router.refresh();
  }

  return (
    <Card className="border-0 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label>Task head</Label>
            <Select
              defaultValue={form.getValues("task_head_id")}
              onValueChange={(value) => form.setValue("task_head_id", value)}
              disabled={taskHeads.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task head" />
              </SelectTrigger>
              <SelectContent>
                {taskHeads.map((head) => (
                  <SelectItem key={head.id} value={head.id}>
                    {head.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-rose-600">{form.formState.errors.task_head_id?.message}</p>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="name">Specific task name</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_area">Target area</Label>
            <Input id="target_area" type="number" step="0.01" {...form.register("target_area")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" {...form.register("unit")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" type="date" {...form.register("start_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" type="date" {...form.register("end_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skilled_workers">Skilled workers</Label>
            <Input id="skilled_workers" type="number" {...form.register("skilled_workers")} />
          </div>
          <div className="space-y-2">
            <Label>Skilled worker trade</Label>
            <Select
              defaultValue={form.getValues("worker_trade")}
              onValueChange={(value) =>
                form.setValue("worker_trade", value as TaskFormValues["worker_trade"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workerTradeOptions.map((trade) => (
                  <SelectItem key={trade} value={trade}>
                    {trade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="helpers">Helpers / laborers</Label>
            <Input id="helpers" type="number" {...form.register("helpers")} />
            <p className="text-xs text-slate-500">Linear rule: 1 skilled worker = 2 helpers.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="output_per_hour">Output per hour</Label>
            <Input
              id="output_per_hour"
              type="number"
              step="0.01"
              {...form.register("output_per_hour")}
            />
            <p className="text-xs text-slate-500">
              Base value from the company productivity rate.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weeks_per_month">Weeks per month</Label>
              <Input
                id="weeks_per_month"
                type="number"
                step="0.01"
                {...form.register("weeks_per_month")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days_per_month">Days per month</Label>
              <Input id="days_per_month" type="number" {...form.register("days_per_month")} />
            </div>
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm lg:col-span-2 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Daily</p>
              <p className="font-semibold text-slate-900">{productivityOutputs.dailyOutput} {form.getValues("unit")}</p>
              <p className="text-xs text-slate-500">output/hr × skilled × 8</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weekly</p>
              <p className="font-semibold text-slate-900">{productivityOutputs.weeklyOutput} {form.getValues("unit")}</p>
              <p className="text-xs text-slate-500">daily × 5 days</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly by weeks</p>
              <p className="font-semibold text-slate-900">{productivityOutputs.monthlyOutputByWeeks} {form.getValues("unit")}</p>
              <p className="text-xs text-slate-500">weekly × weeks/month</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly by days</p>
              <p className="font-semibold text-slate-900">{productivityOutputs.monthlyOutputByDays} {form.getValues("unit")}</p>
              <p className="text-xs text-slate-500">daily × days/month</p>
            </div>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Task status</Label>
            <Select
              defaultValue={form.getValues("status")}
              onValueChange={(value) => form.setValue("status", value as TaskFormValues["status"])}
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
            <p className="text-xs text-slate-500">
              Choose Labor Productivity Issue only when the site team confirms a productivity concern.
            </p>
          </div>
          {form.formState.errors.helpers ? (
            <p className="text-sm text-rose-600 lg:col-span-2">
              {form.formState.errors.helpers.message}
            </p>
          ) : null}
          <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting || taskHeads.length === 0}>
            {form.formState.isSubmitting
              ? mode === "edit" ? "Saving..." : "Creating..."
              : mode === "edit" ? "Save task changes" : "Create task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
