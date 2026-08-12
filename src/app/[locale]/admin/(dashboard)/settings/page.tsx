import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { auth } from "@/lib/auth";
import { getSettings } from "@/actions/settings";
import { SettingEditor } from "@/components/admin/SettingEditor";
import { getDisabledPages, MANAGEABLE_PAGES } from "@/lib/page-toggles";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  // Settings are admin-only — checked here so an EDITOR is sent back to the
  // dashboard instead of tripping the Unauthorized error thrown by
  // getSettings(). The dashboard layout does not re-run on client navigation,
  // so it cannot stand in for this.
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect(`/${locale}/admin?error=insufficient_permissions`);
  }

  const [allSettings, disabledPages] = await Promise.all([
    getSettings(),
    getDisabledPages(),
  ]);

  // page.* keys are driven by the toggles below, not the key/value editor.
  const settings = allSettings.filter((s) => !s.key.startsWith("page."));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {isAr ? "إعدادات الموقع" : "Site Settings"}
          </h1>
          <p className="text-gray-500">
            {isAr
              ? "نصوص وقيم عامة تظهر في الموقع (بالعربية والإنجليزية)"
              : "Site-wide texts and values (Arabic & English)"}
          </p>
        </div>
        <a
          href="/api/admin/backup"
          download
          className="inline-flex items-center gap-2 self-start bg-forest text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#2a2014] transition-colors text-sm"
        >
          ⬇ {isAr ? "تنزيل نسخة احتياطية من قاعدة البيانات" : "Download database backup"}
        </a>
      </div>

      {/* The switches themselves live on their own screen — this is the
          pointer to them, plus an at-a-glance status. */}
      <Link
        href={`/${locale}/admin/pages`}
        className="heritage-card flex items-center justify-between gap-4 px-5 py-4 hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LayoutTemplate size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-foreground">
              {isAr ? "إدارة الصفحات" : "Page Management"}
            </p>
            <p className="text-sm text-gray-500">
              {disabledPages.length === 0
                ? isAr
                  ? `جميع الصفحات (${MANAGEABLE_PAGES.length}) ظاهرة للزوار`
                  : `All ${MANAGEABLE_PAGES.length} pages are visible to visitors`
                : isAr
                  ? `${disabledPages.length} صفحات موقوفة عن الزوار`
                  : `${disabledPages.length} page(s) hidden from visitors`}
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 rtl:rotate-180" />
      </Link>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">
          {isAr ? "القيم العامة" : "General Values"}
        </h2>
        <div className="heritage-card divide-y divide-gray-100">
        {settings.map((setting) => (
          <div key={setting.id} className="px-5 py-4">
            <SettingEditor
              id={setting.id}
              settingKey={setting.key}
              valueAr={setting.valueAr}
              valueEn={setting.valueEn}
            />
          </div>
        ))}
        {settings.length === 0 && (
          <p className="px-5 py-16 text-center text-gray-400">
            {isAr ? "لا توجد إعدادات" : "No settings yet"}
          </p>
        )}
        </div>
      </section>
    </div>
  );
}
