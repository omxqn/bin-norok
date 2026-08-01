import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { MuseumStory } from "@/components/home/MuseumStory";
import { Stats } from "@/components/home/Stats";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FeaturedHalls } from "@/components/home/FeaturedHalls";

export default async function HomePage() {
  const halls = await prisma.museumHall.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <MuseumStory />
      <Stats />
      <FeatureCards />
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
    </div>
  );
}
