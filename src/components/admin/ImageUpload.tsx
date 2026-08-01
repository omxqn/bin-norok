"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/actions/upload";

export function ImageUpload({
  name = "imagePath",
  initialPath,
  label,
}: {
  name?: string;
  initialPath?: string | null;
  label?: string;
}) {
  const [imagePath, setImagePath] = useState(initialPath ?? "");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.success) {
        setImagePath(result.path);
        toast.success("Image uploaded");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div>
      {label && <p className="block text-sm font-medium text-[#3C2415] mb-2">{label}</p>}
      <input type="hidden" name={name} value={imagePath} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {imagePath ? (
        <div className="relative w-full max-w-xs">
          <div className="relative h-40 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <Image src={imagePath} alt="Preview" fill className="object-cover" />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className="text-sm font-bold text-primary hover:underline disabled:opacity-50"
            >
              {isPending ? "..." : "Change image"}
            </button>
            <button
              type="button"
              onClick={() => setImagePath("")}
              className="text-sm font-bold text-red-500 hover:underline inline-flex items-center gap-1"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="w-full max-w-xs h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-8 h-8" />
              <span className="text-sm font-medium">Upload image (JPG/PNG, max 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
