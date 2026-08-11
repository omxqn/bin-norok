"use client";

import * as React from "react";
import { toast } from "sonner";
import { setPageEnabled } from "@/actions/page-toggles";
import { MANAGEABLE_PAGES } from "@/lib/page-toggles";

export function PageToggles({
  disabledSlugs,
  isAr,
}: {
  disabledSlugs: string[];
  isAr: boolean;
}) {
  // Local copy so a switch responds immediately; reconciled on failure.
  const [disabled, setDisabled] = React.useState<string[]>(disabledSlugs);
  const [pending, setPending] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDisabled(disabledSlugs);
  }, [disabledSlugs]);

  async function toggle(slug: string, nextEnabled: boolean) {
    const previous = disabled;

    setPending(slug);
    setDisabled((current) =>
      nextEnabled ? current.filter((s) => s !== slug) : [...current, slug]
    );

    try {
      await setPageEnabled(slug, nextEnabled);
      toast.success(
        nextEnabled
          ? isAr ? "تم تفعيل الصفحة" : "Page enabled"
          : isAr ? "تم إيقاف الصفحة" : "Page disabled"
      );
    } catch (error) {
      setDisabled(previous);
      toast.error(error instanceof Error ? error.message : isAr ? "فشل الحفظ" : "Save failed");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="heritage-card divide-y divide-gray-100">
      {MANAGEABLE_PAGES.map((page) => {
        const isEnabled = !disabled.includes(page.slug);
        const isBusy = pending === page.slug;

        return (
          <div
            key={page.slug}
            className="px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">
                {isAr ? page.labelAr : page.labelEn}
              </p>
              <p className="text-xs text-gray-500 font-mono truncate">{page.path}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-[11px] font-bold tracking-wide uppercase ${
                  isEnabled ? "text-green-700" : "text-red-700"
                }`}
              >
                {isEnabled
                  ? isAr ? "مفعّلة" : "Enabled"
                  : isAr ? "موقوفة" : "Disabled"}
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                aria-label={isAr ? page.labelAr : page.labelEn}
                disabled={isBusy}
                onClick={() => toggle(page.slug, !isEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                  isEnabled ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    isEnabled ? "left-[26px]" : "left-[2px]"
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
