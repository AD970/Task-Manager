import { z } from "zod";

export const AddPromptSchema = z.object({
  prompt: z.string().min(1),
});

export type TypeAddPromptSchema = z.infer<typeof AddPromptSchema>;
