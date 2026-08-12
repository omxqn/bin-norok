"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// A "use server" export is a public POST endpoint, so this admin read is
// gated like the writes below. The public visitors page queries Prisma
// directly.
export async function getOfficialVisits() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Unauthorized");
  }

  return await prisma.officialVisit.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createOfficialVisit(data: {
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  date: string;
  noteAr: string;
  noteEn: string;
  imagePath?: string | null;
  order?: number;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR")) {
    throw new Error("Unauthorized");
  }

  const visit = await prisma.officialVisit.create({
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      date: data.date,
      noteAr: data.noteAr,
      noteEn: data.noteEn,
      imagePath: data.imagePath,
      order: data.order ?? 0,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "OfficialVisit",
      entityId: visit.id,
      details: `Created official visit: ${visit.nameEn}`,
    },
  });

  revalidatePath("/ar/visitors");
  revalidatePath("/en/visitors");
  revalidatePath("/ar/admin/visits");
  revalidatePath("/en/admin/visits");
  
  return visit;
}

export async function updateOfficialVisit(
  id: string,
  data: {
    nameAr: string;
    nameEn: string;
    titleAr: string;
    titleEn: string;
    date: string;
    noteAr: string;
    noteEn: string;
    imagePath?: string | null;
    order?: number;
  }
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR")) {
    throw new Error("Unauthorized");
  }

  const visit = await prisma.officialVisit.update({
    where: { id },
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      date: data.date,
      noteAr: data.noteAr,
      noteEn: data.noteEn,
      imagePath: data.imagePath,
      order: data.order,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "OfficialVisit",
      entityId: visit.id,
      details: `Updated official visit: ${visit.nameEn}`,
    },
  });

  revalidatePath("/ar/visitors");
  revalidatePath("/en/visitors");
  revalidatePath("/ar/admin/visits");
  revalidatePath("/en/admin/visits");
  
  return visit;
}

export async function deleteOfficialVisit(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const visit = await prisma.officialVisit.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "OfficialVisit",
      entityId: id,
      details: `Deleted official visit: ${visit.nameEn}`,
    },
  });

  revalidatePath("/ar/visitors");
  revalidatePath("/en/visitors");
  revalidatePath("/ar/admin/visits");
  revalidatePath("/en/admin/visits");
}
