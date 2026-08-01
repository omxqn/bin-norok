// ===========================================
// Utility Functions
// ===========================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-OM" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date and time for display.
 */
export function formatDateTime(date: Date | string, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-OM" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Generate a URL-friendly slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Get the translated field based on locale.
 * Example: getLocalized(item, "title", "ar") returns item.titleAr
 */
export function getLocalized<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const suffix = locale === "ar" ? "Ar" : "En";
  const key = `${field}${suffix}` as keyof T;
  return (item[key] as string) || "";
}

/**
 * Wait for a specified number of milliseconds (for animations/transitions).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
