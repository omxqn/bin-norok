"use client";

// Small per-entity delete buttons for admin list pages.
// Kept together because they share the same confirm/toast/refresh flow.

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, Check, X } from "lucide-react";
import { deleteHall } from "@/actions/halls";
import { deleteCollectionItem } from "@/actions/collections";
import { deleteNewsEvent } from "@/actions/news";
import { deleteUser } from "@/actions/users";
import { deleteOfficialVisit } from "@/actions/visits";

/** Seconds the inline "are you sure?" stays open before cancelling itself. */
const ARM_TIMEOUT_MS = 5000;

function useDelete(action: (id: string) => Promise<unknown>, label: string) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function runDelete(id: string) {
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

  return { isPending, runDelete };
}

/**
 * Two-step delete: the trash icon arms an inline confirm/cancel pair.
 *
 * This used to call window.confirm(). That dialog is easy to suppress — a
 * browser that has been told to block further dialogs returns false without
 * showing anything, so the button looked dead. The inline step always renders.
 */
function DeleteIcon({
  isPending,
  label,
  onConfirm,
}: {
  isPending: boolean;
  label: string;
  onConfirm: () => void;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function arm() {
    setArmed(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setArmed(false), ARM_TIMEOUT_MS);
  }

  function cancel() {
    clearTimeout(timer.current);
    setArmed(false);
  }

  if (isPending) {
    return (
      <span className="inline-flex items-center justify-center p-2.5 -m-1.5 text-slate-400">
        <Loader2 size={16} className="animate-spin" />
      </span>
    );
  }

  if (armed) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            cancel();
            onConfirm();
          }}
          className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors"
          title={`Delete this ${label} permanently`}
        >
          <Check size={13} />
          Delete
        </button>
        <button
          type="button"
          onClick={cancel}
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
          title="Cancel"
        >
          <X size={14} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={arm}
      className="inline-flex items-center justify-center p-2.5 -m-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}

function makeDeleteButton(action: (id: string) => Promise<unknown>, label: string) {
  return function DeleteButton({ id }: { id: string }) {
    const { isPending, runDelete } = useDelete(action, label);
    return <DeleteIcon isPending={isPending} label={label} onConfirm={() => runDelete(id)} />;
  };
}

export const DeleteHallButton = makeDeleteButton(deleteHall, "hall");
export const DeleteCollectionItemButton = makeDeleteButton(deleteCollectionItem, "item");
export const DeleteNewsButton = makeDeleteButton(deleteNewsEvent, "article");
export const DeleteUserButton = makeDeleteButton(deleteUser, "user");
export const DeleteVisitButton = makeDeleteButton(deleteOfficialVisit, "visit");
