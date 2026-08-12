import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/utils";
import { SafeImage } from "@/components/SafeImage";
import { DeleteVisitButton } from "@/components/admin/DeleteButtons";

export default async function AdminVisitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const visits = await prisma.officialVisit.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {isAr ? "الزيارات الرسمية" : "Official Visits"}
          </h1>
          <p className="text-gray-500">
            {isAr ? `${visits.length} زيارة` : `${visits.length} visits`}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/visits/new`}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm self-start"
        >
          <Plus size={16} /> {isAr ? "إضافة زيارة" : "Add Visit"}
        </Link>
      </div>

      <div className="heritage-card divide-y divide-gray-100">
        {visits.map((visit) => (
          <div key={visit.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-4">
              {visit.imagePath ? (
                <div className="relative w-16 h-16 rounded-lg shrink-0 border overflow-hidden bg-gray-100">
                  <SafeImage src={visit.imagePath} alt={getLocalized(visit, "name", locale)} sizes="64px" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 border flex items-center justify-center text-gray-400 text-xs">
                  {isAr ? "بدون صورة" : "No image"}
                </div>
              )}
              <div>
                <p className="font-bold text-foreground">{getLocalized(visit, "name", locale)}</p>
                <p className="text-sm text-gray-500">{getLocalized(visit, "title", locale)}</p>
                <p className="text-xs text-gray-400 mt-1">{visit.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0" dir="ltr">
              <Link
                href={`/${locale}/admin/visits/${visit.id}`}
                className="text-slate-400 hover:text-blue-500 transition-colors"
                title={isAr ? "تعديل" : "Edit"}
              >
                <Pencil size={16} />
              </Link>
              <DeleteVisitButton id={visit.id} />
            </div>
          </div>
        ))}
        {visits.length === 0 && (
          <p className="px-5 py-16 text-center text-gray-400">
            {isAr ? "لا توجد زيارات مسجلة بعد" : "No visits recorded yet"}
          </p>
        )}
      </div>
    </div>
  );
}
