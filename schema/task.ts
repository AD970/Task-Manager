import { z } from "zod";

export const AddTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title is required!" })
    .max(150, { message: "Dude chill!, limit is 150 letter" }),
  priority: z.enum(["high", "medium", "low"]),
  day: z.date(),
  hour: z.string(),
  description: z.string(),
});

export type TypeAddTaskSchema = z.infer<typeof AddTaskSchema>;
