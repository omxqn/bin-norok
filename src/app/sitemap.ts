import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getDisabledPages, type PageSlug } from "@/lib/page-toggles";
import { siteUrl as appUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The sitemap is prerendered at build time, when the database may be
  // unreachable (no DATABASE_URL in the build environment, or a provider that
  // only resolves at runtime). Degrade to the static page list instead of
  // failing the whole build.
  let halls: { slug: string; updatedAt: Date }[] = [];
  let items: { id: string; updatedAt: Date }[] = [];
  let news: { slug: string; updatedAt: Date }[] = [];

  try {
    [halls, items, news] = await Promise.all([
      prisma.museumHall.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.collectionItem.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
      prisma.newsEvent.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch (error) {
    console.warn("sitemap: database unavailable, emitting static pages only", error);
  }

  // A page an admin has switched off answers with a "temporarily closed"
  // notice, so it should not be advertised to crawlers while it is down.
  // getDisabledPages() already fails open if the database is unreachable.
  const disabled = new Set<string>(await getDisabledPages());
  const isLive = (slug: PageSlug) => !disabled.has(slug);

  const staticPages: { path: string; slug: PageSlug | null }[] = [
    { path: "", slug: null },
    { path: "/about", slug: "about" },
    { path: "/halls", slug: "halls" },
    { path: "/collections", slug: "collections" },
    { path: "/news", slug: "news" },
    { path: "/visit", slug: "visit" },
    { path: "/contact", slug: "contact" },
    { path: "/virtual-tour", slug: "virtual-tour" },
    { path: "/visitors", slug: "visitors" },
    { path: "/heritage", slug: "heritage" },
    { path: "/sohar", slug: "sohar" },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["ar", "en"]) {
    for (const page of staticPages) {
      if (page.slug && !isLive(page.slug)) continue;

      entries.push({
        url: `${appUrl}/${locale}${page.path}`,
        changeFrequency: page.path === "" ? "weekly" : "monthly",
        priority: page.path === "" ? 1 : 0.7,
      });
    }

    if (isLive("halls")) {
      for (const hall of halls) {
        entries.push({ url: `${appUrl}/${locale}/halls/${hall.slug}`, lastModified: hall.updatedAt, priority: 0.8 });
      }
    }

    if (isLive("collections")) {
      for (const item of items) {
        entries.push({ url: `${appUrl}/${locale}/collections/${item.id}`, lastModified: item.updatedAt, priority: 0.6 });
      }
    }

    if (isLive("news")) {
      for (const article of news) {
        entries.push({ url: `${appUrl}/${locale}/news/${article.slug}`, lastModified: article.updatedAt, priority: 0.6 });
      }
    }
  }

  return entries;
}
