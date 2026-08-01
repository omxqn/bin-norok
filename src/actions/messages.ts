"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { messageAdminUpdateSchema, MessageAdminUpdateFormValues } from "@/schemas/message";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getMessage(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.contactMessage.findUnique({
    where: { id },
  });
}

export async function updateMessageStatus(id: string, data: MessageAdminUpdateFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = messageAdminUpdateSchema.parse(data);

  const message = await prisma.contactMessage.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/admin/messages");
  return message;
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const message = await prisma.contactMessage.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "ContactMessage",
      entityId: id,
      details: `Deleted message from ${message.name}`,
    },
  });

  revalidatePath("/admin/messages");
  return message;
}
