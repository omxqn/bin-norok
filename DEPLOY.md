# دليل نشر متحف بن نوروك على Railway + دومين otech

الموقع Next.js 16 + Prisma + SQLite + رفع صور محلي. هذه الطريقة تُبقي كل شيء كما هو
(بلا تحويل قاعدة البيانات) عبر **قرص تخزين دائم** على Railway.

> ملاحظة: القاعدة والصور تعيشان على القرص الدائم `/data`. لا تُخزَّن داخل الحاوية
> حتى لا تضيع مع كل نشر.

---

## الخطوة 1 — ارفع الكود إلى GitHub

من مجلد المشروع:

```bash
git add .
git commit -m "Prepare production deploy (Docker + persistent disk)"
# أنشئ مستودعاً جديداً على github.com ثم:
git remote add origin https://github.com/<حسابك>/zal-museum.git
git branch -M main
git push -u origin main
```

---

## الخطوة 2 — أنشئ مشروع Railway

1. سجّل الدخول على https://railway.app (بحساب GitHub).
2. **New Project → Deploy from GitHub repo →** اختر المستودع.
3. Railway سيكتشف `Dockerfile` تلقائياً ويبدأ أول بناء.

---

## الخطوة 3 — أضِف القرص الدائم (Volume) ⚠️ مهم

1. داخل الخدمة (Service) → تبويب **Variables/Settings → Volumes → New Volume**.
2. **Mount path:** `/data`
3. احفظ. (هنا ستُخزَّن قاعدة البيانات والصور المرفوعة بشكل دائم.)

---

## الخطوة 4 — أضِف متغيّرات البيئة (Variables)

في تبويب **Variables** أضِف التالي (بدّل `yourdomain.com` بدومينك):

```
DATABASE_URL=file:/data/prod.db
UPLOADS_DIR=/data/uploads
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<ولّد مفتاحك الخاص>
AUTH_SECRET=<نفس قيمة NEXTAUTH_SECRET>
AUTH_TRUST_HOST=true
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=ar
SEED_ADMIN_EMAIL=<بريد الأدمن>
SEED_ADMIN_PASSWORD=<كلمة مرور قوية وفريدة>
```

اختياري (لتفعيل إشعارات البريد عبر Resend):

```
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFY_EMAIL=your@email.com
```

> `PORT` تضبطه Railway تلقائياً — لا تضِفه.
> ولّد `NEXTAUTH_SECRET` بنفسك عبر `openssl rand -base64 32`، ولا تنسخ أي مفتاح
> من ملف مثال أو من هذا الدليل — من يملك هذا المفتاح يستطيع تزوير جلسة أدمن كاملة.

بعد حفظ المتغيّرات، Railway سيعيد النشر. سكربت الإقلاع سيقوم تلقائياً بـ:
`prisma db push` (إنشاء الجداول) ثم `seed` (المحتوى الأساسي + حساب الأدمن).

---

## الخطوة 5 — تأكّد أن الموقع يعمل

Railway يمنحك رابطاً مؤقتاً مثل `https://zal-museum-production.up.railway.app`.
افتحه وتأكّد أن الصفحات تعمل، ثم جرّب لوحة الإدارة:

- الرابط: `.../ar/admin/login`
- البريد وكلمة المرور: القيم التي ضبطتها في `SEED_ADMIN_EMAIL` و `SEED_ADMIN_PASSWORD`

> لا تضع كلمة مرور حقيقية في هذا الملف — فهو يُرفع إلى GitHub.

---

## الخطوة 6 — اربط دومين otech

### أ) في Railway
تبويب **Settings → Networking → Custom Domain →** أدخل دومينك (مثلاً `www.yourdomain.com`).
Railway سيعطيك **هدف CNAME** مثل: `abcd1234.up.railway.app`.

### ب) في لوحة otech (DNS)
أضِف السجلّات:

| النوع | الاسم | القيمة |
|-------|-------|--------|
| CNAME | `www` | `abcd1234.up.railway.app` (الذي أعطاك إياه Railway) |

**للدومين الجذر بدون www** (`yourdomain.com`):
- إن كانت otech تدعم **ALIAS/ANAME** على الجذر → أضِف ALIAS يشير لنفس هدف Railway.
- إن لم تدعم (الغالب) → أسهل حلّين:
  1. أضِف في otech **إعادة توجيه (Redirect/Forwarding)** من الجذر إلى `https://www.yourdomain.com`، أو
  2. انقل إدارة DNS إلى **Cloudflare** (مجاني) الذي يدعم CNAME على الجذر (CNAME Flattening) — وقتها تضيف CNAME للجذر مباشرة لهدف Railway.

> انتشار DNS قد يأخذ من دقائق حتى بضع ساعات. شهادة SSL يُصدرها Railway تلقائياً بعد التحقق.

### ج) حدِّث المتغيّرات
بعد ربط الدومين، تأكّد أن `NEXTAUTH_URL` و`NEXT_PUBLIC_APP_URL` = الدومين النهائي
(مع `https://` وبدون `/` في النهاية)، ثم أعِد النشر.

---

## ملاحظات مهمة

- **النسخ الاحتياطي:** قاعدة البيانات ملف `/data/prod.db`. زر «النسخ الاحتياطي» في لوحة الإدارة
  يصدّرها؛ يُنصح بتنزيلها دورياً.
- **الصور المرفوعة:** تُحفظ في `/data/uploads` وتُخدَم عبر مسار `/uploads/...` تلقائياً.
- **النشر على Vercel:** نظام الملفات هناك للقراءة فقط، فلا يعمل `UPLOADS_DIR`. أنشئ
  **Blob Store** من لوحة Vercel (Storage → Blob) وأضِف المتغيّر `BLOB_READ_WRITE_TOKEN`؛
  عند وجوده تُرفع الصور إلى Vercel Blob تلقائياً بدل القرص، والصور القديمة على القرص
  تبقى تعمل. بدون هذا المتغيّر على Vercel سيظهر خطأ واضح عند الرفع بدل تعطّل الصفحة.
- **تحديثات لاحقة:** أي `git push` إلى `main` يُطلق نشراً جديداً تلقائياً، والبيانات تبقى سليمة على القرص.
- **Render كبديل:** نفس الفكرة — Web Service من نوع Docker + Persistent Disk على `/data` ونفس المتغيّرات.
