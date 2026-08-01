"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { userSchema, UserFormValues } from "@/schemas/user";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function getUsers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getUser(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export async function createUser(data: UserFormValues) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = userSchema.parse(data);

  if (!validated.password) {
    throw new Error("Password is required for new users");
  }

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      details: `Created user: ${user.email}`,
    },
  });

  revalidatePath("/admin/users");
  return user;
}

export async function updateUser(id: string, data: UserFormValues) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = userSchema.parse(data);

  const updateData: any = {
    name: validated.name,
    email: validated.email,
    role: validated.role,
  };

  if (validated.password) {
    updateData.password = await bcrypt.hash(validated.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: user.id,
      details: `Updated user: ${user.email}`,
    },
  });

  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  if (session.user.id === id) {
    throw new Error("Cannot delete your own account");
  }

  const user = await prisma.user.delete({
    where: { id },
    select: { id: true, email: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "User",
      entityId: id,
      details: `Deleted user: ${user.email}`,
    },
  });

  revalidatePath("/admin/users");
  return user;
}
