import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  role: z.enum(["Admin", "Supervisor", "Site Engineer", "QA/QC"]),
});

export const projectSchema = z.object({
  project_name: z.string().min(3, "Project name is required."),
  location: z.string().min(2, "Location is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().min(1, "End date is required."),
  created_by: z.string().min(1, "Owner is required."),
});

export const taskHeadSchema = z.object({
  name: z.string().min(2, "Task head name is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().min(1, "End date is required."),
});

export const taskSchema = z
  .object({
    name: z.string().min(2, "Task name is required."),
    target_area: z.coerce.number().positive("Target area must be greater than 0."),
    unit: z.string().min(1, "Unit is required."),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
    skilled_workers: z.coerce.number().int().min(1, "At least 1 skilled worker."),
    helpers: z.coerce.number().int().min(2, "At least 2 helpers."),
    standard_output: z.coerce
      .number()
      .positive("Standard output must be greater than 0."),
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
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProjectFormValues = z.output<typeof projectSchema>;
export type ProjectFormInput = z.input<typeof projectSchema>;
export type TaskHeadFormValues = z.infer<typeof taskHeadSchema>;
export type TaskFormValues = z.output<typeof taskSchema>;
export type TaskFormInput = z.input<typeof taskSchema>;
export type ProgressUpdateFormValues = z.output<typeof progressUpdateSchema>;
export type ProgressUpdateFormInput = z.input<typeof progressUpdateSchema>;
