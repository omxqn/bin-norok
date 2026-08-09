import { z } from "zod";
import { NewsEventType } from "@prisma/client";

export const newsEventSchema = z.object({
  titleAr: z.string().min(2, "Title (Arabic) is required"),
  titleEn: z.string().min(2, "Title (English) is required"),
  slug: z.string().min(2, "Slug is required"),
  excerptAr: z.string().optional(),
  excerptEn: z.string().optional(),
  contentAr: z.string().min(10, "Content (Arabic) is required"),
  contentEn: z.string().min(10, "Content (English) is required"),
  type: z.nativeEnum(NewsEventType),
  imagePath: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  eventDate: z.date().optional().nullable(),
});

export type NewsEventFormValues = z.infer<typeof newsEventSchema>;
