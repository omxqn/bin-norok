// ===========================================
// Where admin-uploaded images may come from
// ===========================================
// Uploads land in one of two places depending on the host:
//   - Vercel Blob (production on Vercel) → an absolute URL on the store host
//   - a writable disk / public/uploads    → a root-relative "/uploads/..." path
// Seeded artwork lives under "/images/...".
//
// Both the stored value and what next/image will accept have to agree. A src
// next/image rejects — a host missing from `remotePatterns`, or a path with no
// leading slash — throws while rendering, which takes down the whole page with
// a server error rather than showing a broken thumbnail. That is what used to
// happen on the admin edit forms, so the check lives here and is shared.

/** Public hostname suffix of a Vercel Blob store. */
export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/**
 * True when `next/image` can be trusted with this src — keep in sync with
 * `images.remotePatterns` in next.config.ts.
 */
export function isOptimizableImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;

  const value = src.trim();
  if (value === "") return false;

  if (value.startsWith("//")) return false;

  if (value.startsWith("/")) return true;

  try {
    const { protocol, hostname } = new URL(value);
    if (protocol !== "https:") return false;

    return hostname.endsWith(BLOB_HOST_SUFFIX) || hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}

/** True for a value we are willing to store as an image path at all. */
export function isStorableImagePath(value: unknown): value is string {
  return typeof value === "string" && isOptimizableImageSrc(value);
}
