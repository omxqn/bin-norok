"use client";

// Multi-step booking wizard. Collects data across steps, then submits the
// whole thing to the existing createBooking server action as one FormData.

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2, Check, ArrowLeft, ArrowRight, Users2, CalendarDays,
  Clock, UserRound, ClipboardCheck, CreditCard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/actions/public";
import { VISIT_TYPES } from "@/lib/constants";

interface Data {
  visitType: string;
  preferredDate: string;
  preferredTime: string;
  numberOfVisitors: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  agree: boolean;
}

const empty: Data = {
  visitType: "INDIVIDUAL",
  preferredDate: "",
  preferredTime: "",
  numberOfVisitors: "1",
  fullName: "",
  email: "",
  phone: "",
  notes: "",
  agree: false,
};

export function BookingWizard() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const Fwd = isAr ? ArrowLeft : ArrowRight;
  const Back = isAr ? ArrowRight : ArrowLeft;
  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  const steps = [
    { icon: Users2, label: isAr ? "نوع الزيارة" : "Visit Type" },
    { icon: CalendarDays, label: isAr ? "التاريخ والوقت" : "Date & Time" },
    { icon: Users2, label: isAr ? "عدد الزوار" : "Visitors" },
    { icon: UserRound, label: isAr ? "بياناتك" : "Your Details" },
    { icon: ClipboardCheck, label: isAr ? "التأكيد" : "Confirm" },
  ];

  const today = new Date().toISOString().split("T")[0];

  // Per-step validation gate for the Next button
  const canProceed = (() => {
    switch (step) {
      case 0: return !!data.visitType;
      case 1: return !!data.preferredDate && !!data.preferredTime;
      case 2: return Number(data.numberOfVisitors) >= 1;
      case 3: return data.fullName.trim().length >= 2 && /\S+@\S+\.\S+/.test(data.email) && data.phone.trim().length >= 6;
      case 4: return data.agree;
      default: return false;
    }
  })();

  function submit() {
    const fd = new FormData();
    fd.set("visitType", data.visitType);
    fd.set("preferredDate", data.preferredDate);
    fd.set("preferredTime", data.preferredTime);
    fd.set("numberOfVisitors", data.numberOfVisitors);
    fd.set("fullName", data.fullName);
    fd.set("email", data.email);
    fd.set("phone", data.phone);
    fd.set("notes", data.notes);
    fd.set("agreeToPayOnArrival", "on");

    startTransition(async () => {
      const result = await createBooking(fd);
      if (result.success) {
        setDone(true);
      } else if (result.error === "rateLimit") {
        toast.error(isAr ? "طلبات كثيرة، حاول لاحقاً." : "Too many requests, try later.");
      } else if (result.error === "disabled") {
        toast.error(
          isAr
            ? "الحجز متوقف مؤقتاً من قبل إدارة المتحف."
            : "Bookings are temporarily closed by the museum."
        );
      } else {
        toast.error(isAr ? "تحقق من البيانات وحاول مجدداً." : "Please check your details and try again.");
      }
    });
  }

  // ---- Success screen ----
  if (done) {
    const visitTypeLabel = VISIT_TYPES.find((v) => v.value === data.visitType);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="heritage-card p-8 md:p-10 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-wine mb-2">
          {isAr ? "تم استلام حجزكم!" : "Booking received!"}
        </h3>
        <p className="text-sm text-ink-3 mb-8">
          {isAr ? "سنتواصل معكم لتأكيد الموعد. الدفع عند الوصول." : "We'll contact you to confirm. Payment on arrival."}
        </p>
        <div className="max-w-sm mx-auto bg-cream rounded-xl border border-gold/20 divide-y divide-gold/10 text-start mb-8">
          {[
            [isAr ? "الاسم" : "Name", data.fullName],
            [isAr ? "النوع" : "Type", isAr ? visitTypeLabel?.labelAr : visitTypeLabel?.labelEn],
            [isAr ? "التاريخ" : "Date", data.preferredDate],
            [isAr ? "الوقت" : "Time", data.preferredTime],
            [isAr ? "عدد الزوار" : "Visitors", data.numberOfVisitors],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-ink-3">{k}</span>
              <span className="font-bold text-ink text-sm">{v}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={() => { setData(empty); setStep(0); setDone(false); }}>
          {isAr ? "حجز آخر" : "Make another booking"}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="heritage-card p-6 md:p-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8" dir={isAr ? "rtl" : "ltr"}>
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const active = i === step;
          const complete = i < step;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  complete ? "bg-forest text-white" : active ? "bg-gold text-[#1a1510]" : "bg-cream-alt text-ink-3"
                }`}>
                  {complete ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-bold text-center hidden sm:block ${active ? "text-wine" : "text-ink-3"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1.5 md:mx-2 rounded-full transition-colors ${complete ? "bg-forest" : "bg-cream-alt"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: isAr ? -24 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isAr ? 24 : -24 }}
          transition={{ duration: 0.28 }}
          className="min-h-[220px]"
        >
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isAr ? "ما نوع زيارتك؟" : "What kind of visit?"}</h3>
              <p className="text-sm text-ink-3 mb-5">{isAr ? "اختر النوع الأنسب لك." : "Choose what fits you best."}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {VISIT_TYPES.map((type) => {
                  const selected = data.visitType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => set({ visitType: type.value })}
                      className={`text-start p-4 rounded-xl border-2 transition-all ${
                        selected ? "border-gold bg-gold/10" : "border-cream-alt hover:border-gold/40 bg-cream"
                      }`}
                    >
                      <span className="font-bold text-ink">{isAr ? type.labelAr : type.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isAr ? "متى تودّ الزيارة؟" : "When would you like to visit?"}</h3>
              <p className="text-sm text-ink-3 mb-5">{isAr ? "اختر التاريخ والوقت المناسبين." : "Pick a date and time."}</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="w-date"><CalendarDays className="inline w-3.5 h-3.5 me-1" />{isAr ? "التاريخ" : "Date"}</Label>
                  <Input id="w-date" type="date" min={today} value={data.preferredDate} onChange={(e) => set({ preferredDate: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="w-time"><Clock className="inline w-3.5 h-3.5 me-1" />{isAr ? "الوقت" : "Time"}</Label>
                  <Input id="w-time" type="time" value={data.preferredTime} onChange={(e) => set({ preferredTime: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isAr ? "كم عدد الزوار؟" : "How many visitors?"}</h3>
              <p className="text-sm text-ink-3 mb-6">{isAr ? "يمكنك تعديل العدد." : "Adjust the count."}</p>
              <div className="flex items-center justify-center gap-6">
                <button type="button" onClick={() => set({ numberOfVisitors: String(Math.max(1, Number(data.numberOfVisitors) - 1)) })}
                  className="w-12 h-12 rounded-full border-2 border-gold/40 text-wine text-2xl font-bold hover:bg-gold/10 transition-colors">−</button>
                <span className="text-5xl font-bold text-wine font-[family-name:var(--font-cormorant)] w-20 text-center">{data.numberOfVisitors}</span>
                <button type="button" onClick={() => set({ numberOfVisitors: String(Math.min(500, Number(data.numberOfVisitors) + 1)) })}
                  className="w-12 h-12 rounded-full border-2 border-gold/40 text-wine text-2xl font-bold hover:bg-gold/10 transition-colors">+</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isAr ? "بيانات التواصل" : "Contact details"}</h3>
              <p className="text-sm text-ink-3 mb-5">{isAr ? "لنتمكن من تأكيد حجزك." : "So we can confirm your booking."}</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="w-name">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
                  <Input id="w-name" value={data.fullName} onChange={(e) => set({ fullName: e.target.value })} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="w-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input id="w-email" type="email" dir="ltr" value={data.email} onChange={(e) => set({ email: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="w-phone">{isAr ? "رقم الهاتف" : "Phone"}</Label>
                    <Input id="w-phone" type="tel" dir="ltr" value={data.phone} onChange={(e) => set({ phone: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="w-notes">{isAr ? "ملاحظات (اختياري)" : "Notes (optional)"}</Label>
                  <Textarea id="w-notes" rows={2} value={data.notes} onChange={(e) => set({ notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isAr ? "مراجعة الحجز" : "Review your booking"}</h3>
              <p className="text-sm text-ink-3 mb-5">{isAr ? "تأكد من صحة البيانات قبل الإرسال." : "Confirm everything is correct."}</p>
              <div className="bg-cream rounded-xl border border-gold/20 divide-y divide-gold/10 mb-5">
                {[
                  [isAr ? "النوع" : "Type", isAr ? VISIT_TYPES.find(v=>v.value===data.visitType)?.labelAr : VISIT_TYPES.find(v=>v.value===data.visitType)?.labelEn],
                  [isAr ? "التاريخ" : "Date", data.preferredDate],
                  [isAr ? "الوقت" : "Time", data.preferredTime],
                  [isAr ? "عدد الزوار" : "Visitors", data.numberOfVisitors],
                  [isAr ? "الاسم" : "Name", data.fullName],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-ink-3">{k}</span>
                    <span className="font-bold text-ink text-sm">{v || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gold/10 border border-gold/25 rounded-xl p-4">
                <p className="text-sm font-bold text-gold-dark flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4" />
                  {isAr ? "الدفع يتم عند الوصول إلى المتحف." : "Payment is made upon arrival at the museum."}
                </p>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={data.agree} onChange={(e) => set({ agree: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#6e2a22]" />
                  <span className="text-sm text-ink font-medium">
                    {isAr ? "أوافق على سداد رسوم التذاكر عند الوصول" : "I agree to pay the ticket fees upon arrival"}
                  </span>
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gold/10">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || isPending}
          className={step === 0 ? "invisible" : ""}
        >
          <Back className="w-4 h-4 me-1.5" />
          {isAr ? "السابق" : "Back"}
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed}>
            {isAr ? "التالي" : "Next"}
            <Fwd className="w-4 h-4 ms-1.5" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!canProceed || isPending} className="bg-gold hover:bg-gold-2 text-[#1a1510]">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "تأكيد الحجز" : "Confirm Booking")}
          </Button>
        )}
      </div>
    </div>
  );
}
