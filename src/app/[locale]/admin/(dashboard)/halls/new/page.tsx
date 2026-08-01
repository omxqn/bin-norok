import { HallForm } from "@/components/admin/HallForm";

export default async function NewHallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-black text-foreground">
        {isAr ? "إضافة قاعة جديدة" : "Add New Hall"}
      </h1>
      <HallForm locale={locale} />
    </div>
  );
}
