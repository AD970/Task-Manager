import { z } from "zod";

export const SignupSchema = z.object({
  display_name: z
    .string()
    .min(1, { message: "Username must be at least 1 character long" })
    .max(20, { message: "Username cannot exceed 20 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

export type TypeSignupSchema = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

export type TypeLoginSchema = z.infer<typeof LoginSchema>;

export const OnCheckSchema = z.object({
 checked: z.boolean()
});


export type TypeOnCheckSchema = z.infer<typeof OnCheckSchema>;
