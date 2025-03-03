import { z } from "zod";

export const AddProjectSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required!" })
    .max(150, { message: "Dude chill!, limit is 150 letter" }),
  priority: z.enum(["high", "medium", "low"]),
  color: z.enum(["indigo", "purple", "normal", "blue"]),

  day: z.date(),
  description: z.string(),
});

export type TypeAddProjectSchema = z.infer<typeof AddProjectSchema>;

export const EditProjectSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required!" })
    .max(150, { message: "Dude chill!, limit is 150 letter" }),
  priority: z.string(),
  // enum causing problem i changed it to string

  day: z.date(),
  description: z.string(),
});

export type TypeEditProjectSchema = z.infer<typeof EditProjectSchema>;
