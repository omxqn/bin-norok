"use client";

// Gallery manager for hall forms: upload several images, reorder-free simple list.

import { useRef, useTransition } from "react";
import { SafeImage } from "@/components/SafeImage";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/actions/upload";
import { MAX_FILE_SIZE } from "@/lib/sanitize";

export function MultiImageUpload({
  paths,
  onChange,
  label,
}: {
  paths: string[];
  onChange: (paths: string[]) => void;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files).slice(0, 10);
    startTransition(async () => {
      const added: string[] = [];
      for (const file of list) {
        // Refuse oversized files up front — the request would be rejected by
        // the server action body limit before reaching our own check.
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name}: max 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const result = await uploadImage(formData);
          if (result.success) {
            added.push(result.path);
          } else {
            toast.error(`${file.name}: ${result.error}`);
          }
        } catch {
          toast.error(`${file.name}: upload failed`);
        }
      }
      if (added.length > 0) {
        onChange([...paths, ...added]);
        toast.success(`${added.length} image(s) uploaded`);
      }
    });
  }

  return (
    <div>
      {label && <p className="block text-sm font-medium text-foreground mb-2">{label}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />

      <div className="flex flex-wrap gap-3">
        {paths.map((path, index) => (
          <div key={`${path}-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
            <SafeImage src={path} alt={`Gallery ${index + 1}`} sizes="96px" />
            <button
              type="button"
              onClick={() => onChange(paths.filter((_, i) => i !== index))}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-6 h-6" />
              <span className="text-[10px] font-medium">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
