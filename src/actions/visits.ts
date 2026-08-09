"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOfficialVisits() {
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
  
  revalidatePath("/ar/visitors");
  revalidatePath("/en/visitors");
  revalidatePath("/ar/admin/visits");
  revalidatePath("/en/admin/visits");
  
  return visit;
}

export async function deleteOfficialVisit(id: string) {
  await prisma.officialVisit.delete({ where: { id } });
  
  revalidatePath("/ar/visitors");
  revalidatePath("/en/visitors");
  revalidatePath("/ar/admin/visits");
  revalidatePath("/en/admin/visits");
}
