import { z } from "zod";

export const taskStatusSchema = z.enum([
  "On Track",
  "At Risk",
  "Delayed",
  "Critical",
  "Completed",
  "Labor Productivity Issue",
]);

export const projectCategorySchema = z.enum(["Structural", "Architectural"]);

export const workerTradeSchema = z.enum([
  "Carpenter",
  "Mason",
  "Steelman",
  "Welder",
  "Painter",
  "Operator",
]);

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Enter your password."),
});

export const projectSchema = z.object({
  project_name: z.string().min(3, "Project name is required."),
  location: z.string().min(2, "Location is required."),
  total_target_area: z.coerce.number().positive("Project area must be greater than 0."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().min(1, "End date is required."),
});

export const taskHeadSchema = z.object({
  category: projectCategorySchema.default("Structural"),
  name: z.string().min(2, "Task head name is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().min(1, "End date is required."),
});

export const taskSchema = z
  .object({
    task_head_id: z.string().min(1, "Task head is required."),
    name: z.string().min(2, "Task name is required."),
    target_area: z.coerce.number().positive("Target area must be greater than 0."),
    unit: z.string().min(1, "Unit is required."),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
    skilled_workers: z.coerce.number().int().min(1, "At least 1 skilled worker."),
    helpers: z.coerce.number().int().min(2, "At least 2 helpers."),
    worker_trade: workerTradeSchema.default("Mason"),
    output_per_hour: z.coerce
      .number()
      .positive("Output per hour must be greater than 0."),
    weeks_per_month: z.coerce
      .number()
      .positive("Weeks per month must be greater than 0.")
      .default(4),
    days_per_month: z.coerce
      .number()
      .int()
      .positive("Days per month must be greater than 0.")
      .default(20),
    standard_output: z.coerce
      .number()
      .nonnegative("Standard output cannot be negative.")
      .default(0),
    status: taskStatusSchema.default("On Track"),
  })
  .refine((values) => values.helpers === values.skilled_workers * 2, {
    message: "Helpers must follow the 1 skilled : 2 helpers rule.",
    path: ["helpers"],
  });

export const progressUpdateSchema = z.object({
  taskId: z.string().min(1, "Task is required."),
  updateType: z.enum(["Weekly", "Monthly"]),
  dateCovered: z.string().min(1, "Date covered is required."),
  actualCompletedArea: z.coerce
    .number()
    .nonnegative("Completed area cannot be negative."),
  remarks: z.string().max(500).optional().default(""),
  updatedBy: z.string().min(1, "Updated by is required."),
  status: taskStatusSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProjectFormValues = z.output<typeof projectSchema>;
export type ProjectFormInput = z.input<typeof projectSchema>;
export type TaskHeadFormValues = z.infer<typeof taskHeadSchema>;
export type TaskHeadFormInput = z.input<typeof taskHeadSchema>;
export type TaskFormValues = z.output<typeof taskSchema>;
export type TaskFormInput = z.input<typeof taskSchema>;
export type ProgressUpdateFormValues = z.output<typeof progressUpdateSchema>;
export type ProgressUpdateFormInput = z.input<typeof progressUpdateSchema>;
