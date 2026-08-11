"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookingAdminUpdateSchema, BookingAdminUpdateFormValues } from "@/schemas/booking";
import { revalidatePath } from "next/cache";

// Bookings carry visitor names, emails and phone numbers. These reads used to
// accept any signed-in account, which let a default-role EDITOR pull the same
// PII the ADMIN-only CSV export is gated on.
function requireBookingAccess(role: string | undefined) {
  if (!role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Unauthorized");
  }
}

export async function getBookings() {
  const session = await auth();
  requireBookingAccess((session?.user as { role?: string } | undefined)?.role);

  return await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getBooking(id: string) {
  const session = await auth();
  requireBookingAccess((session?.user as { role?: string } | undefined)?.role);

  return await prisma.booking.findUnique({
    where: { id },
  });
}

export async function updateBookingStatus(id: string, data: BookingAdminUpdateFormValues) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const validated = bookingAdminUpdateSchema.parse(data);

  const booking = await prisma.booking.update({
    where: { id },
    data: validated,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Booking",
      entityId: booking.id,
      details: `Updated booking status to ${validated.status}`,
    },
  });

  revalidatePath("/admin/bookings");
  return booking;
}

export async function deleteBooking(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const booking = await prisma.booking.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "Booking",
      entityId: id,
      details: `Deleted booking from ${booking.fullName}`,
    },
  });

  revalidatePath("/admin/bookings");
  return booking;
}
