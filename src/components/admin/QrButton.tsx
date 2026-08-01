"use client";

// Generates and downloads a QR code that links to the item's public page —
// meant to be printed and placed next to the physical piece in the museum.

import { useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { QrCode, Download, X } from "lucide-react";

export function QrButton({ itemId, title }: { itemId: string; title: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  async function generate() {
    try {
      const url = `${window.location.origin}/ar/collections/${itemId}`;
      const qr = await QRCode.toDataURL(url, { width: 512, margin: 2 });
      setDataUrl(qr);
    } catch {
      toast.error("Failed to generate QR code");
    }
  }

  return (
    <>
      <button
        onClick={generate}
        className="text-slate-400 hover:text-primary transition-colors"
        title="QR code"
      >
        <QrCode size={16} />
      </button>

      {dataUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setDataUrl(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-xs w-full text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-800 truncate">{title}</p>
              <button onClick={() => setDataUrl(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt={`QR code for ${title}`} className="w-full rounded-lg border border-slate-100" />
            <a
              href={dataUrl}
              download={`qr-${itemId}.png`}
              className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Download size={16} /> تحميل / Download PNG
            </a>
          </div>
        </div>
      )}
    </>
  );
}
