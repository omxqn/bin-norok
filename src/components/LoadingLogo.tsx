import Image from "next/image";

type LoadingLogoProps = {
  /** `page` fills the viewport; `inline` sits inside an existing section. */
  variant?: "page" | "inline";
  label?: string;
};

/**
 * Branded loading indicator — the museum plaque above a row of pulsing dots.
 *
 * The logo is landscape (620x396), so it is rendered at its natural aspect
 * ratio rather than masked into a circle, which cropped the portrait and the
 * bilingual wordmark. Pure CSS animation with no client JS, so this works as a
 * server-rendered Suspense fallback.
 */
export function LoadingLogo({ variant = "page", label }: LoadingLogoProps) {
  const isPage = variant === "page";

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        isPage
          ? // Top padding clears the fixed navbar so nothing is ever clipped.
            "min-h-[100svh] w-full flex flex-col items-center justify-center gap-6 px-6 pt-28 pb-16"
          : "w-full flex flex-col items-center justify-center gap-5 py-16 px-6"
      }
    >
      <Image
        src="/logo-mark.png"
        alt="متحف بن نوروك · Bin Norook Museum"
        width={620}
        height={396}
        priority
        sizes={isPage ? "240px" : "160px"}
        className={
          isPage
            ? "w-[240px] max-w-full h-auto animate-pulse"
            : "w-[160px] max-w-full h-auto animate-pulse"
        }
      />

      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </div>

      <span className="text-[11px] tracking-[0.18em] uppercase text-ink-3">
        {label ?? "جارٍ التحميل · Loading"}
      </span>
    </div>
  );
}
