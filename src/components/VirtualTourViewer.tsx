"use client";

// Real 360° panorama viewer (Pannellum via CDN).
// Looks for /images/museum/panorama.jpg — when the museum photographs a
// panorama and drops it there (or uploads via admin to that path), the
// tour goes live automatically. Until then a styled placeholder shows.

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { PlayCircle, MousePointerClick } from "lucide-react";

const PANORAMA_PATH = "/images/museum/panorama.jpg";
const PANNELLUM_CSS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
const PANNELLUM_JS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

declare global {
  interface Window {
    pannellum?: {
      viewer: (container: HTMLElement, config: Record<string, unknown>) => unknown;
    };
  }
}

export function VirtualTourViewer() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "missing">("checking");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(PANORAMA_PATH, { method: "HEAD" })
      .then((res) => setStatus(res.ok ? "ready" : "missing"))
      .catch(() => setStatus("missing"));
  }, []);

  useEffect(() => {
    if (!started || status !== "ready" || !containerRef.current) return;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = PANNELLUM_CSS;
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = PANNELLUM_JS;
    script.onload = () => {
      if (window.pannellum && containerRef.current) {
        window.pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: PANORAMA_PATH,
          autoLoad: true,
          autoRotate: -2,
          compass: false,
          showFullscreenCtrl: true,
        });
      }
    };
    document.body.appendChild(script);
  }, [started, status]);

  // Live viewer
  if (status === "ready" && started) {
    return (
      <div className="w-full aspect-[3/4] sm:aspect-video bg-[#1a1a1a] rounded-2xl md:rounded-[2rem] shadow-2xl relative overflow-hidden border border-gold/30">
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-[3/4] sm:aspect-video bg-[#2a2014] rounded-2xl md:rounded-[2rem] shadow-2xl relative overflow-hidden group border border-gold/20 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/images/museum/halls/Living room.jpeg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a2014]/90 via-[#2a2014]/20 to-transparent" />

      <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 flex justify-between items-start pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium flex items-center gap-2 border border-white/10">
          <MousePointerClick className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          {isAr ? "اسحب للتجول 360°" : "Drag to look around 360°"}
        </div>
      </div>

      {status === "ready" ? (
        <button
          onClick={() => setStarted(true)}
          className="relative z-10 flex flex-col items-center gap-3 text-white hover:scale-105 transition-transform"
        >
          <span className="w-16 h-16 md:w-24 md:h-24 bg-gold/90 text-[#18140e] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(176,141,63,0.5)] hover:bg-gold transition-colors">
            <PlayCircle className="w-8 h-8 md:w-12 md:h-12 ms-1" />
          </span>
          <span className="font-bold text-sm md:text-base drop-shadow">
            {isAr ? "ابدأ الجولة 360°" : "Start the 360° Tour"}
          </span>
        </button>
      ) : (
        <div className="relative z-10 text-center px-6">
          <span className="mx-auto mb-4 w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-gold-2">
            <PlayCircle className="w-8 h-8 md:w-10 md:h-10 ms-1" />
          </span>
          <h3 className="text-white text-base md:text-2xl font-bold drop-shadow-md mb-1 md:mb-2">
            {isAr ? "قريباً: الجولة 360°" : "Coming Soon: 360° Tour"}
          </h3>
          <p className="text-white/70 font-medium text-xs md:text-base">
            {isAr ? "نقوم حالياً بتجهيز الجولة الافتراضية" : "We are currently preparing the virtual tour"}
          </p>
        </div>
      )}
    </div>
  );
}
