"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import type { BookingStatus } from "@prisma/client";
import { updateBookingStatus, deleteBooking } from "@/actions/bookings";
import { BOOKING_STATUSES } from "@/lib/constants";

export function BookingActions({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: BookingStatus;
  adminNotes: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      try {
        await updateBookingStatus(id, { status: newStatus as BookingStatus, adminNotes });
        toast.success("Booking updated");
        router.refresh();
      } catch {
        toast.error("Failed to update booking");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this booking permanently?")) return;
    startTransition(async () => {
      try {
        await deleteBooking(id);
        toast.success("Booking deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete booking");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white disabled:opacity-50"
      >
        {BOOKING_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.labelEn}
          </option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Delete booking"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
