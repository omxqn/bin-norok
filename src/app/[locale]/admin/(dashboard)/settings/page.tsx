import { getSettings } from "@/actions/settings";
import { SettingEditor } from "@/components/admin/SettingEditor";
import { PageToggles } from "@/components/admin/PageToggles";
import { getDisabledPages } from "@/lib/page-toggles";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
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

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-black text-foreground">
            {isAr ? "الصفحات العامة" : "Public Pages"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAr
              ? "أوقف أي صفحة مؤقتاً. إيقاف صفحة الزيارة يمنع استقبال أي حجز جديد."
              : "Temporarily take a page offline. Disabling the Visit page also stops any new bookings from being submitted."}
          </p>
        </div>
        <PageToggles disabledSlugs={disabledPages} isAr={isAr} />
      </section>

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
