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

/**
 * The only extensions an upload may be stored under, keyed by MIME type.
 * The stored extension is derived from this map, never from the client's
 * filename — otherwise `evil.html` sent with `Content-Type: image/png`
 * lands in public/uploads and executes as HTML on our own origin.
 */
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export function extensionForImageType(mimeType: string): string | null {
  return EXTENSION_BY_MIME[mimeType.toLowerCase()] ?? null;
}

/**
 * Verify the bytes actually are the image format they claim to be.
 * `file.type` is attacker-controlled; the file header is not.
 */
export function sniffImageType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }

  // RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  // AVIF: ....ftyp with an avif/avis brand
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis") return "image/avif";
  }

  return null;
}
