"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { NewsEventType } from "@prisma/client";
import { createNewsEvent, updateNewsEvent } from "@/actions/news";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface NewsFormData {
  id?: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  type: NewsEventType;
  imagePath: string | null;
  link: string | null;
  featured: boolean;
  published: boolean;
  eventDate: string; // yyyy-mm-dd or ""
}

const empty: NewsFormData = {
  slug: "",
  titleAr: "",
  titleEn: "",
  excerptAr: "",
  excerptEn: "",
  contentAr: "",
  contentEn: "",
  type: "NEWS",
  imagePath: "",
  link: "",
  featured: false,
  published: true,
  eventDate: "",
};

export function NewsForm({ article, locale }: { article?: NewsFormData; locale: string }) {
  const initial = article ?? empty;
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const backHref = `/${locale}/admin/news`;

  function handleSubmit(formData: FormData) {
    const imagePath = String(formData.get("imagePath") ?? "");
    const linkStr = String(formData.get("link") ?? "");
    const eventDateStr = String(formData.get("eventDate") ?? "");
    const data = {
      titleAr: String(formData.get("titleAr") ?? ""),
      titleEn: String(formData.get("titleEn") ?? ""),
      slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("titleEn") ?? "")),
      excerptAr: String(formData.get("excerptAr") ?? ""),
      excerptEn: String(formData.get("excerptEn") ?? ""),
      contentAr: String(formData.get("contentAr") ?? ""),
      contentEn: String(formData.get("contentEn") ?? ""),
      type: String(formData.get("type") ?? "NEWS") as NewsEventType,
      imagePath: imagePath || null,
      link: linkStr || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      eventDate: eventDateStr ? new Date(eventDateStr) : null,
    };

    startTransition(async () => {
      try {
        if (article?.id) {
          await updateNewsEvent(article.id, data);
          toast.success(isAr ? "تم حفظ المقال" : "Article saved");
        } else {
          await createNewsEvent(data);
          toast.success(isAr ? "تمت إضافة المقال" : "Article created");
        }
        router.push(backHref);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : isAr ? "فشل الحفظ" : "Failed to save");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-gray-100 p-5 md:p-8 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="titleAr">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
          <Input id="titleAr" name="titleAr" dir="rtl" defaultValue={initial.titleAr} required />
        </div>
        <div>
          <Label htmlFor="titleEn">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
          <Input id="titleEn" name="titleEn" dir="ltr" defaultValue={initial.titleEn} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <Label htmlFor="type">{isAr ? "النوع" : "Type"}</Label>
          <Select id="type" name="type" defaultValue={initial.type}>
            <option value="NEWS">{isAr ? "خبر" : "News"}</option>
            <option value="EVENT">{isAr ? "فعالية" : "Event"}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="eventDate">{isAr ? "تاريخ الفعالية (اختياري)" : "Event Date (optional)"}</Label>
          <Input id="eventDate" name="eventDate" type="date" defaultValue={initial.eventDate} />
        </div>
        <div>
          <Label htmlFor="slug">{isAr ? "المعرّف في الرابط" : "URL Slug"}</Label>
          <Input id="slug" name="slug" dir="ltr" defaultValue={initial.slug} placeholder="auto" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="excerptAr">{isAr ? "مقتطف (عربي)" : "Excerpt (Arabic)"}</Label>
          <Textarea id="excerptAr" name="excerptAr" dir="rtl" rows={2} defaultValue={initial.excerptAr} />
        </div>
        <div>
          <Label htmlFor="excerptEn">{isAr ? "مقتطف (إنجليزي)" : "Excerpt (English)"}</Label>
          <Textarea id="excerptEn" name="excerptEn" dir="ltr" rows={2} defaultValue={initial.excerptEn} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="contentAr">{isAr ? "المحتوى (عربي)" : "Content (Arabic)"}</Label>
          <Textarea id="contentAr" name="contentAr" dir="rtl" rows={7} defaultValue={initial.contentAr} required />
        </div>
        <div>
          <Label htmlFor="contentEn">{isAr ? "المحتوى (إنجليزي)" : "Content (English)"}</Label>
          <Textarea id="contentEn" name="contentEn" dir="ltr" rows={7} defaultValue={initial.contentEn} required />
        </div>
      </div>

      <ImageUpload initialPath={initial.imagePath} label={isAr ? "صورة المقال" : "Article Image"} isAr={isAr} />

      <div className="grid sm:grid-cols-1 gap-5">
        <div>
          <Label htmlFor="link">{isAr ? "رابط خارجي (اختياري)" : "External Link (optional)"}</Label>
          <Input id="link" name="link" dir="ltr" defaultValue={initial.link ?? ""} placeholder="https://" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <input type="checkbox" name="published" defaultChecked={initial.published} className="rounded w-5 h-5" />
          {isAr ? "منشور" : "Published"}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="rounded w-5 h-5" />
          {isAr ? "مميز" : "Featured"}
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white px-8">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : article?.id ? (isAr ? "حفظ التعديلات" : "Save Changes") : isAr ? "إضافة المقال" : "Create Article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
