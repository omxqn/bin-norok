"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    // Basic replacement for the first segment
    const segments = pathname.split("/");
    if (segments.length > 1 && (segments[1] === "ar" || segments[1] === "en")) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    router.push(segments.join("/") || "/");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className="font-bold border-gold/40 text-gold bg-transparent hover:bg-gold/10 hover:text-gold-2 hover:border-gold/60 rounded px-4 tracking-wide"
    >
      {locale === "ar" ? "English" : "العربية"}
    </Button>
  );
}
