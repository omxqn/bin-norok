"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hallSchema, HallFormValues } from "@/schemas/hall";
import { revalidatePath } from "next/cache";

// Reads here include unpublished halls, and a "use server" export is a public
// endpoint — gate them like the writes. Public pages query Prisma directly
// with `published: true`.
async function requireEditor() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getHalls() {
  await requireEditor();

  return await prisma.museumHall.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getHall(id: string) {
  await requireEditor();

  return await prisma.museumHall.findUnique({
    where: { id },
  });
}

export async function createHall(data: HallFormValues) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR")) {
    throw new Error("Unauthorized");
  }

  const validated = hallSchema.parse(data);

  const hall = await prisma.museumHall.create({
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "MuseumHall",
      entityId: hall.id,
      details: `Created hall: ${hall.titleEn}`,
    },
  });

  revalidatePath("/admin/halls");
  return hall;
}

export async function updateHall(id: string, data: HallFormValues) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR")) {
    throw new Error("Unauthorized");
  }

  const validated = hallSchema.parse(data);

  const hall = await prisma.museumHall.update({
    where: { id },
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "MuseumHall",
      entityId: hall.id,
      details: `Updated hall: ${hall.titleEn}`,
    },
  });

  revalidatePath("/admin/halls");
  return hall;
}

export async function setHallImages(hallId: string, paths: string[]) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes((session.user as { role?: string }).role ?? "")) {
    throw new Error("Unauthorized");
  }

  // Replace the gallery atomically: only local upload/image paths are accepted
  const safePaths = paths
    .filter((p) => typeof p === "string" && (p.startsWith("/uploads/") || p.startsWith("/images/")))
    .slice(0, 20);

  await prisma.$transaction([
    prisma.hallImage.deleteMany({ where: { hallId } }),
    prisma.hallImage.createMany({
      data: safePaths.map((path, index) => ({ hallId, path, order: index })),
    }),
  ]);

  revalidatePath("/", "layout");
}

export async function deleteHall(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const hall = await prisma.museumHall.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "MuseumHall",
      entityId: id,
      details: `Deleted hall: ${hall.titleEn}`,
    },
  });

  revalidatePath("/admin/halls");
  return hall;
}
