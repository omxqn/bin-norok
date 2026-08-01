"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Check, X } from "lucide-react";
import { updateSetting } from "@/actions/settings";
import { Input } from "@/components/ui/input";

export function SettingEditor({
  id,
  settingKey,
  valueAr,
  valueEn,
}: {
  id: string;
  settingKey: string;
  valueAr: string;
  valueEn: string;
}) {
  const [editing, setEditing] = useState(false);
  const [ar, setAr] = useState(valueAr);
  const [en, setEn] = useState(valueEn);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    startTransition(async () => {
      try {
        await updateSetting(id, { key: settingKey, valueAr: ar, valueEn: en });
        toast.success("Setting saved");
        setEditing(false);
        router.refresh();
      } catch {
        toast.error("Failed to save setting");
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-xs text-gray-400">{settingKey}</p>
          <p className="text-sm text-gray-700" dir="rtl">{valueAr}</p>
          <p className="text-sm text-gray-500" dir="ltr">{valueEn}</p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-gray-400 hover:text-blue-500 transition-colors shrink-0 self-end sm:self-center"
          title="Edit"
        >
          <Pencil size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-mono text-xs text-gray-400">{settingKey}</p>
      <Input dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} placeholder="العربية" />
      <Input dir="ltr" value={en} onChange={(e) => setEn(e.target.value)} placeholder="English" />
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => { setEditing(false); setAr(valueAr); setEn(valueEn); }}
          disabled={isPending}
          className="text-gray-400 hover:text-red-500 p-1.5"
          title="Cancel"
        >
          <X size={16} />
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-1.5 disabled:opacity-50"
          title="Save"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
      </div>
    </div>
  );
}
