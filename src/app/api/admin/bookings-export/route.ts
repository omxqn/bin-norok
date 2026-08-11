// Admin-only CSV export of all bookings for reporting/archiving.

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);

  // Names and notes come from the public booking form. Excel and Sheets treat
  // a cell starting with = + - @ (or tab/CR) as a formula, so an attacker
  // could book under the name `=cmd|'/c calc'!A1` and get code execution on
  // the admin's machine when they open the export. Prefix with a quote to
  // force it to text; the leading ' is not displayed by spreadsheet apps.
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }

  // Escape quotes and wrap in quotes if it contains a delimiter/newline
  const escaped = s.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "Full Name", "Email", "Phone", "Visit Type", "Preferred Date",
    "Preferred Time", "Visitors", "Status", "Notes", "Requested At",
  ];

  const rows = bookings.map((b) =>
    [
      b.fullName, b.email, b.phone, b.visitType,
      b.preferredDate.toISOString().split("T")[0], b.preferredTime,
      b.numberOfVisitors, b.status, b.notes ?? "",
      b.createdAt.toISOString(),
    ].map(csvCell).join(",")
  );

  // BOM so Excel reads UTF-8 (Arabic) correctly
  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().split("T")[0];

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
