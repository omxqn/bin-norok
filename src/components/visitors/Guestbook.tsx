"use client";

// Digital guestbook: approved visitor entries + a submission form.
// New entries appear on the site only after admin approval.

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, PenLine } from "lucide-react";
import { submitGuestbookEntry } from "@/actions/guestbook";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Guestbook() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);


  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitGuestbookEntry(formData);
      if (result.success) {
        setSubmitted(true);
        formRef.current?.reset();
        toast.success(
          isAr
            ? "شكراً لمشاركتكم! ستظهر كلمتكم بعد مراجعتها."
            : "Thank you! Your entry will appear after review."
        );
      } else if (result.error === "rateLimit") {
        toast.error(isAr ? "طلبات كثيرة، حاول لاحقاً." : "Too many requests, try later.");
      } else {
        toast.error(isAr ? "تحقق من البيانات وحاول مجدداً." : "Check your details and try again.");
      }
    });
  }

  return (
    <section className="mt-20">
      {/* Submission form */}
      <div className="max-w-xl mx-auto heritage-card p-7 md:p-8">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink mb-1">
          <PenLine className="w-4 h-4 text-gold-dark" />
          {isAr ? "اكتب في سجل الزوّار" : "Sign the Guestbook"}
        </h3>
        <p className="text-xs text-ink-3 mb-6">
          {isAr
            ? "شاركنا انطباعك عن زيارتك — يُنشر بعد موافقة إدارة المتحف."
            : "Share your impression — published after museum approval."}
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-lg font-bold text-wine mb-3">
              ✓ {isAr ? "تم استلام مشاركتكم" : "Entry received"}
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              {isAr ? "مشاركة أخرى" : "Write another"}
            </Button>
          </div>
        ) : (
          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gb-name">{isAr ? "الاسم" : "Name"}</Label>
                <Input id="gb-name" name="name" required minLength={2} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="gb-origin">{isAr ? "من أين؟ (اختياري)" : "From where? (optional)"}</Label>
                <Input id="gb-origin" name="origin" maxLength={100} />
              </div>
            </div>
            <div>
              <Label htmlFor="gb-message">{isAr ? "كلمتك" : "Your words"}</Label>
              <Textarea id="gb-message" name="message" rows={3} required minLength={5} maxLength={1000} />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isAr ? "إرسال" : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
