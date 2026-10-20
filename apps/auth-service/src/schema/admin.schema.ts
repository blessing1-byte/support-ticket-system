import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const adminSchema = z.object({
  name: z.string().min(1, "name is not set"),
  email: z
    .string()
    .min(1, "email is not set")
    .regex(emailRegex, "Please enter a valid email address format"),
  password: z.string().min(6, "password is not up to 6 characters"),
});

export type AdminCreationData = z.infer<typeof adminSchema>;
