import type { MetadataRoute } from "next";
import { siteUrl as appUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/ar/admin", "/en/admin", "/api", "/uploads"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
