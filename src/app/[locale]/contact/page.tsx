"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/actions/public";
import { CONTACT_CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (result.success) {
        setSubmitted(true);
        formRef.current?.reset();
        toast.success(t("formSuccess"));
      } else if (result.error === "rateLimit") {
        toast.error(t("formRateLimit"));
      } else {
        toast.error(t("formError"));
      }
    });
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHero
        label={locale === "ar" ? "يسعدنا تواصلكم" : "Get In Touch"}
        title={t("title")}
        description={t("description")}
      />

      <div className="px-6 max-w-7xl mx-auto pt-10">
      <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Direct Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="bg-heritage-dark text-white p-7 md:p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center relative overflow-hidden border border-gold/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

            <h2 className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center">
              <div className="w-1 h-6 bg-primary mr-3 rtl:ml-3 rtl:mr-0 rounded-full"></div>
              {locale === "ar" ? "تواصل مباشر" : "Direct Contact"}
            </h2>
            
            <div className="space-y-6 relative z-10">
              <a href="tel:+96899339323" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">{locale === "ar" ? "الهاتف" : "Phone"}</p>
                  <p className="font-bold text-base tracking-wider text-white group-hover:text-primary transition-colors" dir="ltr">+968 99339323</p>
                </div>
              </a>

              <a href="https://wa.me/96899339323" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">WhatsApp</p>
                  <p className="font-bold text-base tracking-wider text-white group-hover:text-[#25D366] transition-colors" dir="ltr">+968 99339323</p>
                </div>
              </a>

              <a href="mailto:zak.norocinvest@gmail.com" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                  <p className="font-bold text-sm tracking-wide text-white group-hover:text-primary transition-colors" dir="ltr">zak.norocinvest@gmail.com</p>
                </div>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
              <h3 className="text-gray-400 font-medium mb-2">{locale === "ar" ? "مسؤول التواصل" : "Contact Person"}</h3>
              <p className="text-white font-bold text-lg">
                {locale === "ar" ? "م/ عبدالنبي أحمد نوروك البلوشي" : "Eng. Abdulnabi Ahmed Norok Al-Balushi"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-primary/30"
        >
        {submitted ? (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-primary mb-4">✓ {t("formSuccess")}</p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="border-primary text-foreground"
            >
              {t("formAnother")}
            </Button>
          </div>
        ) : (
          <form ref={formRef} action={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">{t("formName")}</Label>
                <Input id="name" name="name" type="text" className="bg-[#F5F0E8]/50" required />
              </div>
              <div>
                <Label htmlFor="email">{t("formEmail")}</Label>
                <Input id="email" name="email" type="email" className="bg-[#F5F0E8]/50" required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="phone">{t("formPhone")}</Label>
                <Input id="phone" name="phone" type="tel" className="bg-[#F5F0E8]/50" />
              </div>
              <div>
                <Label htmlFor="category">{t("formCategory")}</Label>
                <Select id="category" name="category" className="bg-[#F5F0E8]/50" defaultValue="general">
                  {CONTACT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {locale === "ar" ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">{t("formSubject")}</Label>
              <Input id="subject" name="subject" type="text" className="bg-[#F5F0E8]/50" required />
            </div>
            <div>
              <Label htmlFor="message">{t("formMessage")}</Label>
              <Textarea id="message" name="message" className="bg-[#F5F0E8]/50 h-32" required />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : t("formSubmit")}
            </Button>
          </form>
        )}
        </motion.div>
      </div>
      </div>
    </div>
  );
}
