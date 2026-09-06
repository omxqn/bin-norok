"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createOfficialVisit, updateOfficialVisit, setVisitImages } from "@/actions/visits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

export interface VisitFormData {
  id?: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  date: string;
  noteAr: string;
  noteEn: string;
  imagePath: string | null;
  galleryPaths?: string[];
  order: number;
}

const empty: VisitFormData = {
  nameAr: "",
  nameEn: "",
  titleAr: "",
  titleEn: "",
  date: "",
  noteAr: "",
  noteEn: "",
  imagePath: null,
  galleryPaths: [],
  order: 0,
};

export function VisitForm({ visit, locale }: { visit?: VisitFormData; locale: string }) {
  const initial = visit ?? empty;
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [gallery, setGallery] = useState<string[]>(initial.galleryPaths ?? []);
  const router = useRouter();
  const backHref = `/${locale}/admin/visits`;

  function handleSubmit(formData: FormData) {
    const imagePath = String(formData.get("imagePath") ?? "");
    const data = {
      nameAr: String(formData.get("nameAr") ?? ""),
      nameEn: String(formData.get("nameEn") ?? ""),
      titleAr: String(formData.get("titleAr") ?? ""),
      titleEn: String(formData.get("titleEn") ?? ""),
      date: String(formData.get("date") ?? ""),
      noteAr: String(formData.get("noteAr") ?? ""),
      noteEn: String(formData.get("noteEn") ?? ""),
      imagePath: imagePath || null,
      order: Number(formData.get("order") ?? 0),
    };

    startTransition(async () => {
      try {
        let visitId = visit?.id;
        if (visitId) {
          await updateOfficialVisit(visitId, data);
        } else {
          const created = await createOfficialVisit(data);
          visitId = created.id;
        }
        await setVisitImages(visitId, gallery);
        toast.success(
          visit?.id
            ? isAr ? "تم حفظ الزيارة" : "Visit saved"
            : isAr ? "تمت إضافة الزيارة" : "Visit created"
        );
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
          <Label htmlFor="nameAr">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
          <Input id="nameAr" name="nameAr" dir="rtl" defaultValue={initial.nameAr} required />
        </div>
        <div>
          <Label htmlFor="nameEn">{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
          <Input id="nameEn" name="nameEn" dir="ltr" defaultValue={initial.nameEn} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="titleAr">{isAr ? "المسمى الوظيفي (عربي)" : "Title (Arabic)"}</Label>
          <Input id="titleAr" name="titleAr" dir="rtl" defaultValue={initial.titleAr} required />
        </div>
        <div>
          <Label htmlFor="titleEn">{isAr ? "المسمى الوظيفي (إنجليزي)" : "Title (English)"}</Label>
          <Input id="titleEn" name="titleEn" dir="ltr" defaultValue={initial.titleEn} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="date">{isAr ? "التاريخ (سنة أو تاريخ كامل)" : "Date (Year or full date)"}</Label>
          <Input id="date" name="date" dir="ltr" defaultValue={initial.date} required placeholder="e.g. 2023" />
        </div>
        <div>
          <Label htmlFor="order">{isAr ? "الترتيب" : "Order"}</Label>
          <Input id="order" name="order" type="number" dir="ltr" defaultValue={initial.order} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="noteAr">{isAr ? "ملاحظة (عربي)" : "Note (Arabic)"}</Label>
          <Textarea id="noteAr" name="noteAr" dir="rtl" rows={4} defaultValue={initial.noteAr} required />
        </div>
        <div>
          <Label htmlFor="noteEn">{isAr ? "ملاحظة (إنجليزي)" : "Note (English)"}</Label>
          <Textarea id="noteEn" name="noteEn" dir="ltr" rows={4} defaultValue={initial.noteEn} required />
        </div>
      </div>

      <ImageUpload initialPath={initial.imagePath ?? ""} label={isAr ? "الصورة الرئيسية للزيارة (اختياري)" : "Main Visit Image (optional)"} isAr={isAr} />

      <MultiImageUpload
        paths={gallery}
        onChange={setGallery}
        label={isAr ? "صور إضافية للزيارة (تظهر في صفحة الزوّار)" : "Additional Visit Photos (shown on the visitors page)"}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white px-8">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : visit?.id ? (isAr ? "حفظ التعديلات" : "Save Changes") : isAr ? "إضافة زيارة" : "Create Visit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
