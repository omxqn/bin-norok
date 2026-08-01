"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, EyeOff, Trash2, Loader2 } from "lucide-react";
import { setGuestbookApproval, deleteGuestbookEntry } from "@/actions/guestbook";

export function GuestbookActions({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleApproval() {
    startTransition(async () => {
      try {
        await setGuestbookApproval(id, !approved);
        toast.success(approved ? "Hidden from site" : "Approved & published");
        router.refresh();
      } catch {
        toast.error("Failed to update");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this guestbook entry permanently?")) return;
    startTransition(async () => {
      try {
        await deleteGuestbookEntry(id);
        toast.success("Entry deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete");
      }
    });
  }

  if (isPending) {
    return <Loader2 size={16} className="animate-spin text-slate-400" />;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleApproval}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors ${
          approved
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }`}
        title={approved ? "Hide from site" : "Approve"}
      >
        {approved ? <EyeOff size={12} /> : <Check size={12} />}
        {approved ? "منشور" : "بانتظار الموافقة"}
      </button>
      <button
        onClick={handleDelete}
        className="text-slate-400 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
