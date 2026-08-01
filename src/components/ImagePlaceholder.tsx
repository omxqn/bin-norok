"use client";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
  /** Aspect hint only — the placeholder fills its container via className */
  width?: number;
  height?: number;
}

export function ImagePlaceholder({ className, text = "Image" }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-[#4a3b26] to-[#2a2014] text-[#EDE6D8] overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span className="text-sm font-medium tracking-wider uppercase">{text}</span>
      </div>
    </div>
  );
}
