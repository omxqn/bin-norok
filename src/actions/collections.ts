"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { collectionItemSchema, CollectionItemFormValues, collectionCategorySchema, CollectionCategoryFormValues } from "@/schemas/collection";
import { revalidatePath } from "next/cache";

// Reads here include unpublished items, and a "use server" export is a public
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

// --- Items ---

export async function getCollectionItems() {
  await requireEditor();

  return await prisma.collectionItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, hall: true },
  });
}

export async function getCollectionItem(id: string) {
  await requireEditor();

  return await prisma.collectionItem.findUnique({
    where: { id },
  });
}

export async function createCollectionItem(data: CollectionItemFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = collectionItemSchema.parse(data);

  const item = await prisma.collectionItem.create({
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "CollectionItem",
      entityId: item.id,
      details: `Created collection item: ${item.titleEn}`,
    },
  });

  revalidatePath("/admin/collections");
  return item;
}

export async function updateCollectionItem(id: string, data: CollectionItemFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = collectionItemSchema.parse(data);

  const item = await prisma.collectionItem.update({
    where: { id },
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "CollectionItem",
      entityId: item.id,
      details: `Updated collection item: ${item.titleEn}`,
    },
  });

  revalidatePath("/admin/collections");
  return item;
}

export async function deleteCollectionItem(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const item = await prisma.collectionItem.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "CollectionItem",
      entityId: id,
      details: `Deleted collection item: ${item.titleEn}`,
    },
  });

  revalidatePath("/admin/collections");
  return item;
}

// --- Categories ---

export async function getCategories() {
  await requireEditor();

  return await prisma.collectionCategory.findMany();
}

export async function createCategory(data: CollectionCategoryFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = collectionCategorySchema.parse(data);

  const category = await prisma.collectionCategory.create({
    data: validated,
  });

  revalidatePath("/admin/collections/categories");
  return category;
}
