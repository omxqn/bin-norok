"use client";

// Small per-entity delete buttons for admin list pages.
// Kept together because they share the same confirm/toast/refresh flow.

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { deleteHall } from "@/actions/halls";
import { deleteCollectionItem } from "@/actions/collections";
import { deleteNewsEvent } from "@/actions/news";
import { deleteUser } from "@/actions/users";

function useDelete(action: (id: string) => Promise<unknown>, label: string) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    if (!confirm(`Delete this ${label} permanently?`)) return;
    startTransition(async () => {
      try {
        await action(id);
        toast.success(`${label} deleted`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Failed to delete ${label}`);
      }
    });
  }

  return { isPending, handleDelete };
}

function DeleteIcon({ isPending, onClick }: { isPending: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}

export function DeleteHallButton({ id }: { id: string }) {
  const { isPending, handleDelete } = useDelete(deleteHall, "hall");
  return <DeleteIcon isPending={isPending} onClick={() => handleDelete(id)} />;
}

export function DeleteCollectionItemButton({ id }: { id: string }) {
  const { isPending, handleDelete } = useDelete(deleteCollectionItem, "item");
  return <DeleteIcon isPending={isPending} onClick={() => handleDelete(id)} />;
}

export function DeleteNewsButton({ id }: { id: string }) {
  const { isPending, handleDelete } = useDelete(deleteNewsEvent, "article");
  return <DeleteIcon isPending={isPending} onClick={() => handleDelete(id)} />;
}

export function DeleteUserButton({ id }: { id: string }) {
  const { isPending, handleDelete } = useDelete(deleteUser, "user");
  return <DeleteIcon isPending={isPending} onClick={() => handleDelete(id)} />;
}

import { deleteOfficialVisit } from "@/actions/visits";

export function DeleteVisitButton({ id }: { id: string }) {
  const { isPending, handleDelete } = useDelete(deleteOfficialVisit, "visit");
  return <DeleteIcon isPending={isPending} onClick={() => handleDelete(id)} />;
}
