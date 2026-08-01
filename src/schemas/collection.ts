import { z } from "zod";

export const collectionItemSchema = z.object({
  titleAr: z.string().min(2, "Title (Arabic) is required"),
  titleEn: z.string().min(2, "Title (English) is required"),
  descriptionAr: z.string().min(10, "Description (Arabic) is required"),
  descriptionEn: z.string().min(10, "Description (English) is required"),
  longDescriptionAr: z.string().optional(),
  longDescriptionEn: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  hallId: z.string().optional().nullable(),
  period: z.string().optional(),
  imagePath: z.string().optional(),
  condition: z.string().optional(),
  historicalNoteAr: z.string().optional(),
  historicalNoteEn: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type CollectionItemFormValues = z.infer<typeof collectionItemSchema>;

export const collectionCategorySchema = z.object({
  nameAr: z.string().min(2, "Name (Arabic) is required"),
  nameEn: z.string().min(2, "Name (English) is required"),
  slug: z.string().min(2, "Slug is required"),
});

export type CollectionCategoryFormValues = z.infer<typeof collectionCategorySchema>;
