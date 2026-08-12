import Image from "next/image";
import { isOptimizableImageSrc } from "@/lib/image-src";

/**
 * next/image for sources it accepts, a plain <img> for anything else.
 *
 * next/image throws while rendering when a src is not a leading-slash path and
 * its host is missing from `remotePatterns`. Because these sources come from
 * the database, one odd row used to take a whole page down with a server error
 * — the admin edit forms were the worst of it. Falling back keeps the page up
 * and shows the image unoptimized instead.
 *
 * Always positioned with `fill`, so every caller keeps its own sized wrapper.
 */
export function SafeImage({
  src,
  alt,
  sizes,
  className = "object-cover",
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (isOptimizableImageSrc(src)) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`absolute inset-0 w-full h-full ${className}`} />
  );
}
