"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createHall, updateHall, setHallImages } from "@/actions/halls";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

export interface HallFormData {
  id?: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  imagePath?: string;
  order: number;
  published: boolean;
  galleryPaths?: string[];
}

const empty: HallFormData = {
  slug: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  longDescriptionAr: "",
  longDescriptionEn: "",
  imagePath: "",
  order: 0,
  published: true,
};

export function HallForm({ hall, locale }: { hall?: HallFormData; locale: string }) {
  const initial = hall ?? empty;
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [gallery, setGallery] = useState<string[]>(hall?.galleryPaths ?? []);
  const router = useRouter();
  const backHref = `/${locale}/admin/collections`;

  function handleSubmit(formData: FormData) {
    const imagePath = String(formData.get("imagePath") ?? "");
    const data = {
      titleAr: String(formData.get("titleAr") ?? ""),
      titleEn: String(formData.get("titleEn") ?? ""),
      slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("titleEn") ?? "")),
      descriptionAr: String(formData.get("descriptionAr") ?? ""),
      descriptionEn: String(formData.get("descriptionEn") ?? ""),
      longDescriptionAr: String(formData.get("longDescriptionAr") ?? ""),
      longDescriptionEn: String(formData.get("longDescriptionEn") ?? ""),
      ...(imagePath ? { imagePath } : {}),
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    };

    startTransition(async () => {
      try {
        let hallId = hall?.id;
        if (hallId) {
          await updateHall(hallId, data);
        } else {
          const created = await createHall(data);
          hallId = created.id;
        }
        await setHallImages(hallId, gallery);
        toast.success(hall?.id ? (isAr ? "تم حفظ القاعة" : "Hall saved") : isAr ? "تمت إضافة القاعة" : "Hall created");
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
          <Label htmlFor="titleAr">{isAr ? "الاسم (عربي)" : "Title (Arabic)"}</Label>
          <Input id="titleAr" name="titleAr" dir="rtl" defaultValue={initial.titleAr} required />
        </div>
        <div>
          <Label htmlFor="titleEn">{isAr ? "الاسم (إنجليزي)" : "Title (English)"}</Label>
          <Input id="titleEn" name="titleEn" dir="ltr" defaultValue={initial.titleEn} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="slug">{isAr ? "المعرّف في الرابط (اختياري)" : "URL Slug (optional)"}</Label>
          <Input id="slug" name="slug" dir="ltr" defaultValue={initial.slug} placeholder="auto" />
        </div>
        <div>
          <Label htmlFor="order">{isAr ? "ترتيب العرض" : "Display Order"}</Label>
          <Input id="order" name="order" type="number" defaultValue={initial.order} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="descriptionAr">{isAr ? "وصف مختصر (عربي)" : "Short Description (Arabic)"}</Label>
          <Textarea id="descriptionAr" name="descriptionAr" dir="rtl" rows={3} defaultValue={initial.descriptionAr} required />
        </div>
        <div>
          <Label htmlFor="descriptionEn">{isAr ? "وصف مختصر (إنجليزي)" : "Short Description (English)"}</Label>
          <Textarea id="descriptionEn" name="descriptionEn" dir="ltr" rows={3} defaultValue={initial.descriptionEn} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="longDescriptionAr">{isAr ? "وصف مفصّل (عربي)" : "Long Description (Arabic)"}</Label>
          <Textarea id="longDescriptionAr" name="longDescriptionAr" dir="rtl" rows={5} defaultValue={initial.longDescriptionAr} />
        </div>
        <div>
          <Label htmlFor="longDescriptionEn">{isAr ? "وصف مفصّل (إنجليزي)" : "Long Description (English)"}</Label>
          <Textarea id="longDescriptionEn" name="longDescriptionEn" dir="ltr" rows={5} defaultValue={initial.longDescriptionEn} />
        </div>
      </div>

      <ImageUpload initialPath={initial.imagePath} label={isAr ? "الصورة الرئيسية للقاعة" : "Main Hall Image"} isAr={isAr} />

      <MultiImageUpload
        paths={gallery}
        onChange={setGallery}
        label={isAr ? "معرض صور القاعة (يظهر في صفحة القاعة)" : "Hall Gallery (shown on the hall page)"}
      />

      <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
        <input type="checkbox" name="published" defaultChecked={initial.published} className="rounded w-5 h-5" />
        {isAr ? "منشورة (تظهر في الموقع)" : "Published (visible on the site)"}
      </label>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white px-8">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : hall?.id ? (isAr ? "حفظ التعديلات" : "Save Changes") : isAr ? "إضافة القاعة" : "Create Hall"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
