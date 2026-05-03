"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  taskSchema,
  type TaskFormInput,
  type TaskFormValues,
} from "@/lib/validations/forms";

export function TaskForm() {
  const form = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      target_area: 0,
      unit: "sq.m",
      start_date: "",
      end_date: "",
      skilled_workers: 1,
      helpers: 2,
      standard_output: 0,
    },
  });

  function onSubmit(values: TaskFormValues) {
    toast.success(`Task "${values.name}" validated with the manpower rule applied.`);
  }

  return (
    <Card className="border-0 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-2">
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
            <Label htmlFor="helpers">Helpers / laborers</Label>
            <Input id="helpers" type="number" {...form.register("helpers")} />
            <p className="text-xs text-slate-500">Linear rule: 1 skilled worker = 2 helpers.</p>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="standard_output">Standard output per day</Label>
            <Input
              id="standard_output"
              type="number"
              step="0.01"
              {...form.register("standard_output")}
            />
          </div>
          {form.formState.errors.helpers ? (
            <p className="text-sm text-rose-600 lg:col-span-2">
              {form.formState.errors.helpers.message}
            </p>
          ) : null}
          <Button type="submit" className="w-fit">
            Validate task setup
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
