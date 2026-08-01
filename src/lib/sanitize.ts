// ===========================================
// Input Sanitization Utility
// ===========================================

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return input.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Sanitize a string input: trim, strip HTML tags, limit length.
 */
export function sanitizeString(
  input: string,
  maxLength: number = 1000
): string {
  if (!input) return "";
  return stripHtml(input.trim()).slice(0, maxLength);
}

/**
 * Sanitize an email address.
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

/**
 * Sanitize a phone number — allow digits, +, -, spaces, parens.
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-\s()]/g, "").slice(0, 20);
}

/**
 * Generate a safe filename from user input.
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal and special characters
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 100);
}

/**
 * Validate that a file type is an allowed image type.
 */
export function isAllowedImageType(mimeType: string): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];
  return allowedTypes.includes(mimeType.toLowerCase());
}

/**
 * Maximum allowed file size in bytes (5MB).
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
