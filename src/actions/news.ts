"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { newsEventSchema, NewsEventFormValues } from "@/schemas/news";
import { revalidatePath } from "next/cache";

export async function getNewsEvents() {
  return await prisma.newsEvent.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewsEvent(id: string) {
  return await prisma.newsEvent.findUnique({
    where: { id },
  });
}

export async function createNewsEvent(data: NewsEventFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = newsEventSchema.parse(data);

  const newsEvent = await prisma.newsEvent.create({
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "NewsEvent",
      entityId: newsEvent.id,
      details: `Created news/event: ${newsEvent.titleEn}`,
    },
  });

  revalidatePath("/admin/news");
  return newsEvent;
}

export async function updateNewsEvent(id: string, data: NewsEventFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = newsEventSchema.parse(data);

  const newsEvent = await prisma.newsEvent.update({
    where: { id },
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "NewsEvent",
      entityId: newsEvent.id,
      details: `Updated news/event: ${newsEvent.titleEn}`,
    },
  });

  revalidatePath("/admin/news");
  return newsEvent;
}

export async function deleteNewsEvent(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const newsEvent = await prisma.newsEvent.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "NewsEvent",
      entityId: id,
      details: `Deleted news/event: ${newsEvent.titleEn}`,
    },
  });

  revalidatePath("/admin/news");
  return newsEvent;
}
