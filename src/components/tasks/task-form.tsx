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
  type TaskFormInput,
  type TaskFormValues,
} from "@/lib/validations/forms";
import type { TaskHeadSummary } from "@/types/project";

const taskStatusOptions = taskStatusSchema.options;
const skilledWorkerFields = [
  ["supervisor_workers", "Supervisor"],
  ["foreman_workers", "Foreman"],
  ["carpenter_workers", "Carpenter"],
  ["mason_workers", "Mason"],
  ["steelman_workers", "Steelman"],
  ["welder_workers", "Welder"],
  ["painter_workers", "Painter"],
  ["operator_workers", "Operator"],
] as const;

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
      supervisor_workers: 0,
      foreman_workers: 0,
      carpenter_workers: 0,
      mason_workers: 1,
      steelman_workers: 0,
      welder_workers: 0,
      painter_workers: 0,
      operator_workers: 0,
      skilled_workers: 1,
      helpers: 2,
      worker_trade: "Mason",
      output_per_hour: 0,
      time_hours: 8,
      weeks_per_month: 4,
      days_per_month: 20,
      standard_output: 0,
      status: "On Track",
    },
  });
  const outputPerHour = Number(useWatch({ control: form.control, name: "output_per_hour" }) ?? 0);
  const helpers = Number(useWatch({ control: form.control, name: "helpers" }) ?? 0);
  const timeHours = Number(useWatch({ control: form.control, name: "time_hours" }) ?? 8);
  const weeksPerMonth = Number(useWatch({ control: form.control, name: "weeks_per_month" }) ?? 4);
  const daysPerMonth = Number(useWatch({ control: form.control, name: "days_per_month" }) ?? 20);
  const supervisorWorkers = Number(useWatch({ control: form.control, name: "supervisor_workers" }) ?? 0);
  const foremanWorkers = Number(useWatch({ control: form.control, name: "foreman_workers" }) ?? 0);
  const carpenterWorkers = Number(useWatch({ control: form.control, name: "carpenter_workers" }) ?? 0);
  const masonWorkers = Number(useWatch({ control: form.control, name: "mason_workers" }) ?? 0);
  const steelmanWorkers = Number(useWatch({ control: form.control, name: "steelman_workers" }) ?? 0);
  const welderWorkers = Number(useWatch({ control: form.control, name: "welder_workers" }) ?? 0);
  const painterWorkers = Number(useWatch({ control: form.control, name: "painter_workers" }) ?? 0);
  const operatorWorkers = Number(useWatch({ control: form.control, name: "operator_workers" }) ?? 0);
  const productivityOutputs = calculateProductivityOutputs({
    outputPerHour,
    supervisorWorkers,
    foremanWorkers,
    carpenterWorkers,
    masonWorkers,
    steelmanWorkers,
    welderWorkers,
    painterWorkers,
    operatorWorkers,
    helpers,
    hoursPerDay: timeHours,
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
      supervisor_workers: 0,
      foreman_workers: 0,
      carpenter_workers: 0,
      mason_workers: 1,
      steelman_workers: 0,
      welder_workers: 0,
      painter_workers: 0,
      operator_workers: 0,
      skilled_workers: 1,
      helpers: 2,
      worker_trade: "Mason",
      output_per_hour: 0,
      time_hours: 8,
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
          <div className="space-y-3 lg:col-span-2">
            <div>
              <Label>Skilled workers</Label>
              <p className="mt-1 text-xs text-slate-500">
                Sheet1 role columns. Total skilled workers: {productivityOutputs.totalSkilledWorkers}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {skilledWorkerFields.map(([field, label]) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={field} className="text-xs text-slate-500">
                    {label}
                  </Label>
                  <Input id={field} type="number" min={0} {...form.register(field)} />
                </div>
              ))}
            </div>
            <p className="text-xs text-rose-600">{form.formState.errors.mason_workers?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="helpers">Helpers / laborers</Label>
            <Input id="helpers" type="number" {...form.register("helpers")} />
            <p className="text-xs text-slate-500">
              Sheet1 labor output divides skilled output by helpers.
            </p>
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
              Use the Slow, Average, or Fast value from Sheet1.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="time_hours">Time</Label>
              <Input
                id="time_hours"
                type="number"
                step="0.01"
                {...form.register("time_hours")}
              />
            </div>
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
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm lg:col-span-2 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Daily output per day</p>
              <p className="font-semibold text-slate-900">
                Skilled: {productivityOutputs.dailySkilledOutput} {form.getValues("unit")}
              </p>
              <p className="text-xs text-slate-500">
                Labor: {productivityOutputs.dailyLaborOutput} {form.getValues("unit")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weekly</p>
              <p className="font-semibold text-slate-900">
                Skilled: {productivityOutputs.weeklySkilledOutput} {form.getValues("unit")}
              </p>
              <p className="text-xs text-slate-500">
                Labor: {productivityOutputs.weeklyLaborOutput} {form.getValues("unit")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly</p>
              <p className="font-semibold text-slate-900">
                Skilled: {productivityOutputs.monthlySkilledOutput} {form.getValues("unit")}
              </p>
              <p className="text-xs text-slate-500">
                Labor: {productivityOutputs.monthlyLaborOutput} {form.getValues("unit")}
              </p>
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
