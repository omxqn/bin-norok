// ===========================================
// Application Constants
// ===========================================

export const APP_NAME = "Bin Norouk Museum";
export const APP_NAME_AR = "متحف بن نوروك";

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";

export const VISIT_TYPES = [
  { value: "INDIVIDUAL", labelAr: "زيارة فردية", labelEn: "Individual" },
  { value: "FAMILY", labelAr: "زيارة عائلية", labelEn: "Family" },
  { value: "SCHOOL", labelAr: "زيارة مدرسية", labelEn: "School" },
  { value: "GROUP", labelAr: "زيارة جماعية", labelEn: "Group" },
  { value: "OFFICIAL_DELEGATION", labelAr: "وفد رسمي", labelEn: "Official Delegation" },
] as const;

export const BOOKING_STATUSES = [
  { value: "PENDING", labelAr: "قيد الانتظار", labelEn: "Pending", color: "yellow" },
  { value: "CONFIRMED", labelAr: "مؤكد", labelEn: "Confirmed", color: "green" },
  { value: "CANCELLED", labelAr: "ملغي", labelEn: "Cancelled", color: "red" },
  { value: "COMPLETED", labelAr: "مكتمل", labelEn: "Completed", color: "blue" },
] as const;

export const CONTACT_CATEGORIES = [
  { value: "general", labelAr: "استفسار عام", labelEn: "General Inquiry" },
  { value: "visit_booking", labelAr: "حجز زيارة", labelEn: "Visit Booking" },
  { value: "school_visit", labelAr: "زيارة مدرسية", labelEn: "School Visit" },
  { value: "media", labelAr: "طلب إعلامي", labelEn: "Media Request" },
  { value: "donation", labelAr: "إهداء مقتنيات", labelEn: "Collection Donation" },
] as const;

export const NEWS_TYPES = [
  { value: "NEWS", labelAr: "خبر", labelEn: "News" },
  { value: "EVENT", labelAr: "فعالية", labelEn: "Event" },
] as const;

export const ROLES = [
  { value: "SUPER_ADMIN", labelAr: "مدير عام", labelEn: "Super Admin" },
  { value: "ADMIN", labelAr: "مدير", labelEn: "Admin" },
  { value: "EDITOR", labelAr: "محرر", labelEn: "Editor" },
] as const;

// ─── Image Placeholder Paths ──────────────────────────
// Replace these with real images by updating the files in /public/images/museum/
export const PLACEHOLDER_IMAGES = {
  hero: "/images/museum/placeholders/hero-placeholder.jpg",
  hallReception: "/images/museum/placeholders/hall-reception.jpg",
  hallDocuments: "/images/museum/placeholders/hall-documents.jpg",
  hallAhmedBinNorouk: "/images/museum/placeholders/hall-ahmed-bin-norouk.jpg",
  hallAzza: "/images/museum/placeholders/hall-azza.jpg",
  hallSultanate: "/images/museum/placeholders/hall-sultanate.jpg",
  hallGlobal: "/images/museum/placeholders/hall-global.jpg",
  hallOldHouse: "/images/museum/placeholders/hall-old-house.jpg",
  hallWomensHeritage: "/images/museum/placeholders/hall-womens-heritage.jpg",
  collectionStamps: "/images/museum/placeholders/collection-stamps.jpg",
  collectionCoins: "/images/museum/placeholders/collection-coins.jpg",
  collectionDocuments: "/images/museum/placeholders/collection-documents.jpg",
  itemDefault: "/images/museum/placeholders/item-default.jpg",
} as const;

// ─── Museum Info ──────────────────────────────────────
export const MUSEUM_INFO = {
  openingYear: 2021,
  location: {
    ar: "صحار، شمال الباطنة، سلطنة عُمان",
    en: "Sohar, North Al Batinah, Oman",
  },
  type: {
    ar: "متحف تراثي خاص",
    en: "Private Heritage Museum",
  },
  focus: {
    ar: "التراث، الوثائق، العملات، الطوابع، الصور",
    en: "Heritage, Documents, Coins, Stamps, Photos",
  },
} as const;
