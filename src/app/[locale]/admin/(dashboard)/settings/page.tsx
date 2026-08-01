import { getSettings } from "@/actions/settings";
import { SettingEditor } from "@/components/admin/SettingEditor";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const settings = await getSettings();

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
    </div>
  );
}
