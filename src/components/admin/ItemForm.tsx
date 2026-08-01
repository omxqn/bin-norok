"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createCollectionItem, updateCollectionItem } from "@/actions/collections";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface ItemFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  categoryId: string;
  hallId: string | null;
  period: string;
  condition: string;
  historicalNoteAr: string;
  historicalNoteEn: string;
  imagePath?: string;
  featured: boolean;
  published: boolean;
}

export interface OptionData {
  id: string;
  nameAr: string;
  nameEn: string;
}

const empty: ItemFormData = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  longDescriptionAr: "",
  longDescriptionEn: "",
  categoryId: "",
  hallId: null,
  period: "",
  condition: "",
  historicalNoteAr: "",
  historicalNoteEn: "",
  imagePath: "",
  featured: false,
  published: true,
};

export function ItemForm({
  item,
  categories,
  halls,
  locale,
}: {
  item?: ItemFormData;
  categories: OptionData[];
  halls: OptionData[];
  locale: string;
}) {
  const initial = item ?? empty;
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const backHref = `/${locale}/admin/collections`;

  function handleSubmit(formData: FormData) {
    const imagePath = String(formData.get("imagePath") ?? "");
    const hallId = String(formData.get("hallId") ?? "");
    const data = {
      titleAr: String(formData.get("titleAr") ?? ""),
      titleEn: String(formData.get("titleEn") ?? ""),
      descriptionAr: String(formData.get("descriptionAr") ?? ""),
      descriptionEn: String(formData.get("descriptionEn") ?? ""),
      longDescriptionAr: String(formData.get("longDescriptionAr") ?? ""),
      longDescriptionEn: String(formData.get("longDescriptionEn") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      hallId: hallId || null,
      period: String(formData.get("period") ?? ""),
      condition: String(formData.get("condition") ?? ""),
      historicalNoteAr: String(formData.get("historicalNoteAr") ?? ""),
      historicalNoteEn: String(formData.get("historicalNoteEn") ?? ""),
      ...(imagePath ? { imagePath } : {}),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    };

    startTransition(async () => {
      try {
        if (item?.id) {
          await updateCollectionItem(item.id, data);
          toast.success(isAr ? "تم حفظ المقتنى" : "Item saved");
        } else {
          await createCollectionItem(data);
          toast.success(isAr ? "تمت إضافة المقتنى" : "Item created");
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
          <Label htmlFor="categoryId">{isAr ? "التصنيف" : "Category"}</Label>
          <Select id="categoryId" name="categoryId" defaultValue={initial.categoryId} required>
            <option value="" disabled>
              {isAr ? "اختر تصنيفاً" : "Choose a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {isAr ? cat.nameAr : cat.nameEn}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="hallId">{isAr ? "القاعة (اختياري)" : "Hall (optional)"}</Label>
          <Select id="hallId" name="hallId" defaultValue={initial.hallId ?? ""}>
            <option value="">{isAr ? "بدون قاعة" : "No hall"}</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {isAr ? hall.nameAr : hall.nameEn}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="descriptionAr">{isAr ? "وصف (عربي)" : "Description (Arabic)"}</Label>
          <Textarea id="descriptionAr" name="descriptionAr" dir="rtl" rows={3} defaultValue={initial.descriptionAr} required />
        </div>
        <div>
          <Label htmlFor="descriptionEn">{isAr ? "وصف (إنجليزي)" : "Description (English)"}</Label>
          <Textarea id="descriptionEn" name="descriptionEn" dir="ltr" rows={3} defaultValue={initial.descriptionEn} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="period">{isAr ? "الحقبة الزمنية" : "Period / Era"}</Label>
          <Input id="period" name="period" defaultValue={initial.period} placeholder={isAr ? "مثال: القرن 18" : "e.g. 18th century"} />
        </div>
        <div>
          <Label htmlFor="condition">{isAr ? "الحالة" : "Condition"}</Label>
          <Input id="condition" name="condition" defaultValue={initial.condition} placeholder={isAr ? "مثال: ممتازة" : "e.g. Excellent"} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="historicalNoteAr">{isAr ? "ملاحظة تاريخية (عربي)" : "Historical Note (Arabic)"}</Label>
          <Textarea id="historicalNoteAr" name="historicalNoteAr" dir="rtl" rows={3} defaultValue={initial.historicalNoteAr} />
        </div>
        <div>
          <Label htmlFor="historicalNoteEn">{isAr ? "ملاحظة تاريخية (إنجليزي)" : "Historical Note (English)"}</Label>
          <Textarea id="historicalNoteEn" name="historicalNoteEn" dir="ltr" rows={3} defaultValue={initial.historicalNoteEn} />
        </div>
      </div>

      <ImageUpload initialPath={initial.imagePath} label={isAr ? "صورة المقتنى" : "Item Image"} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <input type="checkbox" name="published" defaultChecked={initial.published} className="rounded w-4 h-4" />
          {isAr ? "منشور" : "Published"}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="rounded w-4 h-4" />
          {isAr ? "مميز (يظهر في الواجهة)" : "Featured"}
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white px-8">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : item?.id ? (isAr ? "حفظ التعديلات" : "Save Changes") : isAr ? "إضافة المقتنى" : "Create Item"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
