"use server";

// Public-facing form submissions (no auth required):
// visit bookings and contact messages, both rate-limited per IP.

import { prisma } from "@/lib/prisma";
import { publicBookingSchema } from "@/schemas/booking";
import { publicMessageSchema } from "@/schemas/message";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { notifyAdmin, sendVisitorEmail, bookingEmailHtml, messageEmailHtml, bookingConfirmationHtml } from "@/lib/email";
import { isPageEnabled } from "@/lib/page-toggles";
import { headers } from "next/headers";

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export type PublicActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createBooking(formData: FormData): Promise<PublicActionResult> {
  // Checked here, not just on the page: a server action is a public POST
  // endpoint, so hiding the form is not enough to stop a booking.
  if (!(await isPageEnabled("visit"))) {
    return { success: false, error: "disabled" };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(ip, "booking");
  if (!rate.success) {
    return { success: false, error: "rateLimit" };
  }

  const parsed = publicBookingSchema.safeParse({
    fullName: sanitizeString(String(formData.get("fullName") ?? ""), 100),
    email: sanitizeEmail(String(formData.get("email") ?? "")),
    phone: sanitizePhone(String(formData.get("phone") ?? "")),
    visitType: formData.get("visitType"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: sanitizeString(String(formData.get("preferredTime") ?? ""), 20),
    numberOfVisitors: formData.get("numberOfVisitors"),
    notes: sanitizeString(String(formData.get("notes") ?? ""), 2000) || undefined,
    agreeToPayOnArrival: formData.get("agreeToPayOnArrival") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: "validation" };
  }

  try {
    const { agreeToPayOnArrival, ...dbData } = parsed.data;
    const booking = await prisma.booking.create({ data: dbData });
    await Promise.all([
      notifyAdmin(
        `حجز جديد من ${booking.fullName} — New Booking`,
        bookingEmailHtml(booking)
      ),
      sendVisitorEmail(
        booking.email,
        "تأكيد استلام حجزكم — Bin Norouk Museum Booking",
        bookingConfirmationHtml(booking)
      ),
    ]);
    return { success: true };
  } catch {
    return { success: false, error: "server" };
  }
}

export async function submitContactMessage(formData: FormData): Promise<PublicActionResult> {
  if (!(await isPageEnabled("contact"))) {
    return { success: false, error: "disabled" };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(ip, "contact");
  if (!rate.success) {
    return { success: false, error: "rateLimit" };
  }

  const parsed = publicMessageSchema.safeParse({
    name: sanitizeString(String(formData.get("name") ?? ""), 100),
    email: sanitizeEmail(String(formData.get("email") ?? "")),
    phone: sanitizePhone(String(formData.get("phone") ?? "")) || undefined,
    category: sanitizeString(String(formData.get("category") ?? "general"), 50) || "general",
    subject: sanitizeString(String(formData.get("subject") ?? ""), 200),
    message: sanitizeString(String(formData.get("message") ?? ""), 5000),
  });

  if (!parsed.success) {
    return { success: false, error: "validation" };
  }

  try {
    const message = await prisma.contactMessage.create({ data: parsed.data });
    await notifyAdmin(
      `رسالة جديدة: ${message.subject} — New Message`,
      messageEmailHtml(message)
    );
    return { success: true };
  } catch {
    return { success: false, error: "server" };
  }
}
