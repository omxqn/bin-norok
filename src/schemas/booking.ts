import { z } from "zod";
import { BookingStatus, VisitType } from "@prisma/client";

export const publicBookingSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required").max(20),
  visitType: z.nativeEnum(VisitType),
  preferredDate: z.coerce.date(),
  preferredTime: z.string().min(1, "Time is required").max(20),
  numberOfVisitors: z.coerce.number().int().min(1).max(500),
  notes: z.string().max(2000).optional(),
  agreeToPayOnArrival: z.boolean().refine(val => val === true, "You must agree to pay upon arrival"),
});

export type PublicBookingFormValues = z.infer<typeof publicBookingSchema>;

export const bookingAdminUpdateSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  adminNotes: z.string().optional().nullable(),
});

export type BookingAdminUpdateFormValues = z.infer<typeof bookingAdminUpdateSchema>;
