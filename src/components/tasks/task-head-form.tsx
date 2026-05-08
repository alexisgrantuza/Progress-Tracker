"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTaskHead } from "@/lib/actions";
import {
  projectCategorySchema,
  taskHeadSchema,
  type TaskHeadFormInput,
  type TaskHeadFormValues,
} from "@/lib/validations/forms";

const projectCategoryOptions = projectCategorySchema.options;

export function TaskHeadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const form = useForm<TaskHeadFormInput, unknown, TaskHeadFormValues>({
    resolver: zodResolver(taskHeadSchema),
    defaultValues: {
      category: "Structural",
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  async function onSubmit(values: TaskHeadFormValues) {
    const result = await createTaskHead(projectId, values);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`Task head "${values.name}" created.`);
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label>Category</Label>
        <Select
          defaultValue={form.getValues("category")}
          onValueChange={(value) =>
            form.setValue("category", value as TaskHeadFormValues["category"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projectCategoryOptions.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="task-head-name">Task head name</Label>
        <Input id="task-head-name" {...form.register("name")} />
        <p className="text-xs text-rose-600">{form.formState.errors.name?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-head-start">Start date</Label>
        <Input id="task-head-start" type="date" {...form.register("start_date")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-head-end">End date</Label>
        <Input id="task-head-end" type="date" {...form.register("end_date")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-fit md:col-span-2">
        {form.formState.isSubmitting ? "Creating..." : "Create task head"}
      </Button>
    </form>
  );
}
