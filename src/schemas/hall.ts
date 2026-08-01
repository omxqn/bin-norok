import { z } from "zod";

export const hallSchema = z.object({
  titleAr: z.string().min(2, "Title (Arabic) is required"),
  titleEn: z.string().min(2, "Title (English) is required"),
  slug: z.string().min(2, "Slug is required"),
  descriptionAr: z.string().min(10, "Description (Arabic) is required"),
  descriptionEn: z.string().min(10, "Description (English) is required"),
  longDescriptionAr: z.string().optional(),
  longDescriptionEn: z.string().optional(),
  imagePath: z.string().optional(),
  order: z.coerce.number().default(0),
  published: z.boolean().default(true),
});

export type HallFormValues = z.infer<typeof hallSchema>;
