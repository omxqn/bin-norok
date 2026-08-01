import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [halls, items, news] = await Promise.all([
    prisma.museumHall.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.collectionItem.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
    prisma.newsEvent.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = ["", "/about", "/halls", "/collections", "/news", "/visit", "/contact", "/virtual-tour", "/visitors", "/heritage"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["ar", "en"]) {
    for (const page of staticPages) {
      entries.push({
        url: `${appUrl}/${locale}${page}`,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.7,
      });
    }
    for (const hall of halls) {
      entries.push({ url: `${appUrl}/${locale}/halls/${hall.slug}`, lastModified: hall.updatedAt, priority: 0.8 });
    }
    for (const item of items) {
      entries.push({ url: `${appUrl}/${locale}/collections/${item.id}`, lastModified: item.updatedAt, priority: 0.6 });
    }
    for (const article of news) {
      entries.push({ url: `${appUrl}/${locale}/news/${article.slug}`, lastModified: article.updatedAt, priority: 0.6 });
    }
  }

  return entries;
}
