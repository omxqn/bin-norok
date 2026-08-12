import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageToggles } from "@/components/admin/PageToggles";
import { getDisabledPages, MANAGEABLE_PAGES } from "@/lib/page-toggles";

// Page availability management. The dashboard layout is a convenience gate
// only (it does not re-run on client navigation), so this page checks the
// role itself — as does every toggle action it calls.
export default async function AdminPagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect(`/${locale}/admin?error=insufficient_permissions`);
  }

  const disabledPages = await getDisabledPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          {isAr ? "إدارة الصفحات" : "Page Management"}
        </h1>
        <p className="text-gray-500">
          {isAr
            ? "تحكّم في الصفحات التي يراها الزوار. الصفحة الموقوفة تُخفى من القوائم وتعرض رسالة “مغلقة مؤقتاً” لمن يفتح رابطها."
            : "Control which pages visitors can see. A disabled page disappears from the menus and shows a “temporarily closed” notice to anyone who opens its link."}
        </p>
      </div>

      {disabledPages.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {isAr
            ? `${disabledPages.length} من ${MANAGEABLE_PAGES.length} صفحات موقوفة حالياً عن الزوار.`
            : `${disabledPages.length} of ${MANAGEABLE_PAGES.length} pages are currently hidden from visitors.`}
        </div>
      )}

      <PageToggles disabledSlugs={disabledPages} locale={locale} />

      <p className="text-xs text-gray-400">
        {isAr
          ? "الصفحة الرئيسية ولوحة الإدارة تبقيان متاحتين دائماً. كل تغيير يُسجَّل في سجل النشاطات."
          : "The home page and the admin dashboard always stay available. Every change is written to the activity log."}
      </p>
    </div>
  );
}
