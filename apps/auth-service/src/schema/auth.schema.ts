// //validates user inputs
//checks against null values and other edge cases
import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z
    .string()
    .min(1, "valid email is required")
    .regex(emailRegex, "Please enter a valid email address format"),
  password: z.string().min(6, "password is not up to 6 characters"),
  // .regex(
  //   passwordRegex,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  // ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "valid email is required")
    .regex(emailRegex, "Please enter a valid email address format"),
  password: z.string().min(6, "password is not up to 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

//strict rules that every input should follow

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(6, "password is not up to 6 characters"),
  newPassword: z.string().min(6, "password is not up to 6 characters"),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z
    .string()
    .min(1, "valid email is required")
    .regex(emailRegex, "Please enter a valid email address format"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
