import { prisma } from "@/lib/prisma";
import { VisitorsContent } from "@/components/visitors/VisitorsContent";

export default async function VisitorsPage() {
  const [govVisits, newsEvents, guestbookEntries] = await Promise.all([
    prisma.officialVisit.findMany({ orderBy: { order: "asc" } }),
    prisma.newsEvent.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.guestbookEntry.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <VisitorsContent
      govVisits={govVisits}
      newsEvents={newsEvents}
      guestbookEntries={guestbookEntries}
    />
  );
}
