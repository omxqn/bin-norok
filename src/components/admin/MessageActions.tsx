"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MailOpen, Mail, Archive, ArchiveRestore, Trash2, Loader2 } from "lucide-react";
import { updateMessageStatus, deleteMessage } from "@/actions/messages";

export function MessageActions({
  id,
  isRead,
  isArchived,
}: {
  id: string;
  isRead: boolean;
  isArchived: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update(data: { isRead: boolean; isArchived: boolean }, label: string) {
    startTransition(async () => {
      try {
        await updateMessageStatus(id, data);
        toast.success(label);
        router.refresh();
      } catch {
        toast.error("Failed to update message");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this message permanently?")) return;
    startTransition(async () => {
      try {
        await deleteMessage(id);
        toast.success("Message deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete message");
      }
    });
  }

  if (isPending) {
    return <Loader2 size={16} className="animate-spin text-slate-400" />;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => update({ isRead: !isRead, isArchived }, isRead ? "Marked as unread" : "Marked as read")}
        className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
        title={isRead ? "Mark as unread" : "Mark as read"}
      >
        {isRead ? <Mail size={16} /> : <MailOpen size={16} />}
      </button>
      <button
        onClick={() => update({ isRead: true, isArchived: !isArchived }, isArchived ? "Restored" : "Archived")}
        className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
        title={isArchived ? "Restore" : "Archive"}
      >
        {isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
      </button>
      <button
        onClick={handleDelete}
        className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
