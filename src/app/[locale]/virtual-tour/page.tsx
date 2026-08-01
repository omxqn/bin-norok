"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { VirtualTourViewer } from "@/components/VirtualTourViewer";

export default function VirtualTourPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col items-center pb-32">
      <div className="w-full">
        <PageHero
          label={isAr ? "تجربة تفاعلية" : "Interactive Experience"}
          title={isAr ? "الجولة الافتراضية" : "Virtual Tour"}
          description={
            isAr
              ? "اكتشف قاعات المتحف وعش تجربة فريدة وكأنك تتجول في أروقته بنفسك عبر هذه الجولة الافتراضية التفاعلية."
              : "Discover the museum halls and live a unique experience as if you were wandering through its corridors yourself via this interactive virtual tour."
          }
        />
      </div>

      {/* Tour Viewer */}
      <div className="container max-w-7xl mx-auto px-6 pt-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <VirtualTourViewer />
        </motion.div>

        <p className="text-center text-xs text-ink-3 mt-4">
          {isAr
            ? "لتفعيل الجولة: ضع صورة بانورامية (equirectangular) في المسار images/museum/panorama.jpg"
            : "To activate the tour: place an equirectangular panorama at images/museum/panorama.jpg"}
        </p>
      </div>
    </div>
  );
}
