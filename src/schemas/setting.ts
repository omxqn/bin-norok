import { z } from "zod";

export const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  valueAr: z.string().min(1, "Value (Arabic) is required"),
  valueEn: z.string().min(1, "Value (English) is required"),
});

export type SiteSettingFormValues = z.infer<typeof siteSettingSchema>;
