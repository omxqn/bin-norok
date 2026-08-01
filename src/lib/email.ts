// ===========================================
// Email Notifications (Resend)
// ===========================================
// Notifies museum staff about new bookings and contact messages.
// Silently skips when RESEND_API_KEY is not configured, so the
// forms keep working without an email account.

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL;

const resend = apiKey ? new Resend(apiKey) : null;

export async function notifyAdmin(subject: string, html: string): Promise<void> {
  if (!resend || !notifyEmail) return;
  try {
    await resend.emails.send({
      from: `Bin Norouk Museum <${fromEmail}>`,
      to: notifyEmail,
      subject,
      html,
    });
  } catch (error) {
    // Never let a notification failure break the user-facing flow
    console.error("Email notification failed:", error);
  }
}

export async function sendVisitorEmail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: `Bin Norouk Museum <${fromEmail}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Visitor email failed:", error);
  }
}

export function bookingConfirmationHtml(booking: {
  id: string;
  fullName: string;
  preferredDate: Date;
  preferredTime: string;
  numberOfVisitors: number;
}): string {
  const ref = booking.id.slice(-8).toUpperCase();
  return `
    <div style="font-family: sans-serif; max-width: 560px; border:1px solid #eee; border-radius:12px; overflow:hidden;">
      <div style="background:#453723; color:#F5ECD8; padding:20px 24px;">
        <h2 style="margin:0;">متحف بن نوروك — Bin Norouk Museum</h2>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">مرحباً <b>${booking.fullName}</b>،</p>
        <p>تم استلام طلب حجزكم بنجاح وسنتواصل معكم للتأكيد.<br/>
        Your booking request has been received — we will contact you to confirm.</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          <tr><td style="padding:6px 0; color:#666;">رقم المرجع / Reference</td><td style="font-weight:bold; font-family:monospace;">${ref}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">التاريخ / Date</td><td>${booking.preferredDate.toISOString().split("T")[0]}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">الوقت / Time</td><td>${booking.preferredTime}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">عدد الزوار / Visitors</td><td>${booking.numberOfVisitors}</td></tr>
        </table>
        <p style="background:#f7f2e8; border-radius:8px; padding:12px; font-size:14px;">
          💳 الدفع يتم عند الوصول إلى المتحف — Payment is made upon arrival at the museum.
        </p>
        <p style="color:#999; font-size:12px;">صحار، سلطنة عُمان · +968 99339323</p>
      </div>
    </div>`;
}

export function bookingEmailHtml(booking: {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  numberOfVisitors: number;
  visitType: string;
  notes?: string | null;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2 style="color:#6e2a22;">حجز جديد — New Booking Request</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:6px 0; color:#666;">الاسم / Name</td><td style="font-weight:bold;">${booking.fullName}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">البريد / Email</td><td>${booking.email}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">الهاتف / Phone</td><td>${booking.phone}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">النوع / Type</td><td>${booking.visitType}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">التاريخ / Date</td><td>${booking.preferredDate.toISOString().split("T")[0]} — ${booking.preferredTime}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">الزوار / Visitors</td><td>${booking.numberOfVisitors}</td></tr>
        ${booking.notes ? `<tr><td style="padding:6px 0; color:#666;">ملاحظات / Notes</td><td>${booking.notes}</td></tr>` : ""}
      </table>
      <p style="color:#999; font-size:12px; margin-top:16px;">Bin Norouk Museum — automated notification</p>
    </div>`;
}

export function messageEmailHtml(message: {
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  subject: string;
  message: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2 style="color:#6e2a22;">رسالة جديدة — New Contact Message</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:6px 0; color:#666;">الاسم / Name</td><td style="font-weight:bold;">${message.name}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">البريد / Email</td><td>${message.email}</td></tr>
        ${message.phone ? `<tr><td style="padding:6px 0; color:#666;">الهاتف / Phone</td><td>${message.phone}</td></tr>` : ""}
        <tr><td style="padding:6px 0; color:#666;">التصنيف / Category</td><td>${message.category}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">الموضوع / Subject</td><td style="font-weight:bold;">${message.subject}</td></tr>
      </table>
      <div style="background:#f8f8f8; border-radius:8px; padding:12px; margin-top:12px; white-space:pre-line;">${message.message}</div>
      <p style="color:#999; font-size:12px; margin-top:16px;">Bin Norouk Museum — automated notification</p>
    </div>`;
}
