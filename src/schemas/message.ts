import { z } from "zod";

export const publicMessageSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().max(20).optional(),
  category: z.string().max(50).default("general"),
  subject: z.string().min(2, "Subject is required").max(200),
  message: z.string().min(5, "Message is required").max(5000),
});

export type PublicMessageFormValues = z.infer<typeof publicMessageSchema>;

export const messageAdminUpdateSchema = z.object({
  isRead: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type MessageAdminUpdateFormValues = z.infer<typeof messageAdminUpdateSchema>;
