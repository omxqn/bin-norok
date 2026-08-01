"use server";

// Small admin utilities shared by dashboard list pages.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type PublishableEntity = "hall" | "item" | "news";

export async function togglePublish(entity: PublishableEntity, id: string) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Unauthorized");
  }

  if (entity === "hall") {
    const hall = await prisma.museumHall.findUnique({ where: { id } });
    if (!hall) throw new Error("Not found");
    await prisma.museumHall.update({ where: { id }, data: { published: !hall.published } });
  } else if (entity === "item") {
    const item = await prisma.collectionItem.findUnique({ where: { id } });
    if (!item) throw new Error("Not found");
    await prisma.collectionItem.update({ where: { id }, data: { published: !item.published } });
  } else {
    const news = await prisma.newsEvent.findUnique({ where: { id } });
    if (!news) throw new Error("Not found");
    await prisma.newsEvent.update({ where: { id }, data: { published: !news.published } });
  }

  revalidatePath("/", "layout");
}
