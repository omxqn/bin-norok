"use client";

import { useState, useEffect } from "react";
import { SafeImage } from "@/components/SafeImage";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { motion, AnimatePresence } from "framer-motion";

export function HallImageSlider({ images, fallbackText, className = "h-72" }: { images: string[], fallbackText: string, className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return <ImagePlaceholder text={fallbackText} className={`w-full ${className}`} />;
  }

  const currentImage = images[currentIndex];
  const isRealImage = currentImage && currentImage.includes("/");

  return (
    <div className={`relative w-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {isRealImage ? (
            <>
              {/* Blurred background for a premium look when object is contained */}
              <div className="absolute inset-0 overflow-hidden">
                <SafeImage
                  src={currentImage}
                  alt="Background"
                  className="object-cover blur-xl opacity-40 scale-110"
                />
              </div>
              {/* Main uncropped image */}
              <SafeImage
                src={currentImage}
                alt="Hall Image"
                className="object-contain z-10"
              />
            </>
          ) : (
            <ImagePlaceholder text={currentImage || fallbackText} className="w-full h-full" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
