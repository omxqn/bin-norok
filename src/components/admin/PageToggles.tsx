"use client";

import * as React from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";
import { setAllPagesEnabled, setPageEnabled } from "@/actions/page-toggles";
import { MANAGEABLE_PAGES } from "@/lib/page-toggles";

export function PageToggles({
  disabledSlugs,
  locale,
}: {
  disabledSlugs: string[];
  locale: string;
}) {
  const isAr = locale === "ar";
  // Local copy so a switch responds immediately; reconciled on failure.
  const [disabled, setDisabled] = React.useState<string[]>(disabledSlugs);
  const [pending, setPending] = React.useState<string | null>(null);
  const [bulkPending, setBulkPending] = React.useState(false);

  React.useEffect(() => {
    setDisabled(disabledSlugs);
  }, [disabledSlugs]);

  const liveCount = MANAGEABLE_PAGES.length - disabled.length;

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

  async function toggleAll(nextEnabled: boolean) {
    if (
      !nextEnabled &&
      !window.confirm(
        isAr
          ? "سيتم إيقاف جميع الصفحات العامة. لن يبقى للزوار سوى الصفحة الرئيسية. هل تريد المتابعة؟"
          : "This takes every public page offline — visitors will only see the home page. Continue?"
      )
    ) {
      return;
    }

    const previous = disabled;

    setBulkPending(true);
    setDisabled(nextEnabled ? [] : MANAGEABLE_PAGES.map((p) => p.slug));

    try {
      await setAllPagesEnabled(nextEnabled);
      toast.success(
        nextEnabled
          ? isAr ? "تم تفعيل جميع الصفحات" : "All pages enabled"
          : isAr ? "تم إيقاف جميع الصفحات" : "All pages disabled"
      );
    } catch (error) {
      setDisabled(previous);
      toast.error(error instanceof Error ? error.message : isAr ? "فشل الحفظ" : "Save failed");
    } finally {
      setBulkPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-bold text-gray-600">
          {isAr
            ? `${liveCount} من ${MANAGEABLE_PAGES.length} صفحات ظاهرة للزوار`
            : `${liveCount} of ${MANAGEABLE_PAGES.length} pages visible to visitors`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleAll(true)}
            disabled={bulkPending || disabled.length === 0}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            {isAr ? "تفعيل الكل" : "Enable all"}
          </button>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            disabled={bulkPending || disabled.length === MANAGEABLE_PAGES.length}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            {isAr ? "إيقاف الكل" : "Disable all"}
          </button>
        </div>
      </div>

      <div className="heritage-card divide-y divide-gray-100">
        {MANAGEABLE_PAGES.map((page) => {
          const isEnabled = !disabled.includes(page.slug);
          const isBusy = pending === page.slug || bulkPending;

          return (
            <div
              key={page.slug}
              className="px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">
                  {isAr ? page.labelAr : page.labelEn}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isAr ? page.noteAr : page.noteEn}
                </p>
                <a
                  href={`/${locale}${page.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-primary font-mono mt-1 transition-colors"
                >
                  /{locale}
                  {page.path}
                  <ExternalLink size={11} />
                </a>
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
                  {pending === page.slug ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white mx-auto" />
                  ) : (
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        isEnabled ? "left-[26px]" : "left-[2px]"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
