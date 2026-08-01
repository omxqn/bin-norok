"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { togglePublish } from "@/actions/admin";

export function PublishToggle({
  entity,
  id,
  published,
}: {
  entity: "hall" | "item" | "news";
  id: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    startTransition(async () => {
      try {
        await togglePublish(entity, id);
        toast.success(published ? "Hidden from site" : "Published to site");
        router.refresh();
      } catch {
        toast.error("Failed to update");
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
        published
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
      title={published ? "Click to hide" : "Click to publish"}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : published ? (
        <Eye size={12} />
      ) : (
        <EyeOff size={12} />
      )}
      {published ? "Published" : "Hidden"}
    </button>
  );
}
