import { prisma } from "@/lib/prisma";
import { getDisabledPages } from "@/lib/page-toggles";
import { Hero } from "@/components/home/Hero";
import { MuseumStory } from "@/components/home/MuseumStory";
import { Stats } from "@/components/home/Stats";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FeaturedHalls } from "@/components/home/FeaturedHalls";

export default async function HomePage() {
  // The home page itself is never switched off, but it links into pages that
  // can be — those links have to disappear with them.
  const [halls, disabledPages] = await Promise.all([
    prisma.museumHall.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    getDisabledPages(),
  ]);

  const hallsEnabled = !disabledPages.includes("halls");

  return (
    <div className="flex flex-col min-h-screen">
      <Hero disabledPages={disabledPages} />
      <MuseumStory disabledPages={disabledPages} />
      <Stats />
      <FeatureCards disabledPages={disabledPages} />
      {hallsEnabled && (
        <FeaturedHalls
          halls={halls.map((hall) => ({
            id: hall.id,
            slug: hall.slug,
            titleAr: hall.titleAr,
            titleEn: hall.titleEn,
            descriptionAr: hall.descriptionAr,
            descriptionEn: hall.descriptionEn,
            imagePath: hall.imagePath,
          }))}
        />
      )}
    </div>
  );
}
