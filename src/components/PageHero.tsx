// Dark editorial page banner — ported from the reference design's .page-hero:
// forest-to-ink gradient, faint gold diamond lattice, gold hairline at the bottom.

import { FadeIn } from "@/components/FadeIn";

export function PageHero({
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative pt-28 pb-9 md:pt-32 md:pb-10 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#5a4830] to-[#332818] text-center">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23f0d890' stroke-width='.5'/%3E%3C/svg%3E\")",
          backgroundSize: "60px",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F0D878]/60 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <FadeIn className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5ECD8] mb-4 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-[#F5ECD8]/70 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
