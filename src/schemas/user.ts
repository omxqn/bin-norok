import { z } from "zod";
import { Role } from "@prisma/client";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(), // Optional for updates
  role: z.nativeEnum(Role),
});

export type UserFormValues = z.infer<typeof userSchema>;
