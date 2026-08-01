// ===========================================
// Bin Norouk Museum - Database Seed Script
// ===========================================
// Run: npx prisma db seed

import { PrismaClient, Role, VisitType, BookingStatus, NewsEventType } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🏛️  Seeding Bin Norouk Museum database...\n");

  // ─── 1. Create Super Admin ──────────────────────────
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("MuseumAdmin2024!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@binnorouk.museum" },
    update: {},
    create: {
      name: "Museum Administrator",
      email: "admin@binnorouk.museum",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`   ✓ Admin created: ${admin.email}`);

  // ─── 2. Create Museum Halls ─────────────────────────
  console.log("\n🏛️  Creating museum halls...");
  const halls = await Promise.all([
    prisma.museumHall.upsert({
      where: { slug: "lounge" },
      update: {},
      create: {
        slug: "lounge",
        titleAr: "الصالة",
        titleEn: "The Lounge",
        descriptionAr: "تحتوي الصالة على لوحة 'أنا و والدي'، و خريطة مسار عمل الوالد، و بعض مساهماتي العمرانية.",
        descriptionEn: "The lounge features the 'My Father and I' painting, a map of my father's career path, and architectural contributions.",
        longDescriptionAr: "تحتوي الصالة على لوحة 'أنا و والدي'، و تتضمن خريطة توضّع مسار عمل والدي سابقاً، و تنقّله بين مختلف ولايات و محافظات السلطنة. أيضاً، تشمل اللوحة بعضاً من مساهماتي كمدير لمكتب التصميم العمراني في ديوان شؤون البلاط السلطاني، من أبرزها سوق الأسماك و سوق صحار...",
        longDescriptionEn: "The hall features the 'My Father and I' painting and includes a map detailing my father's previous career path and his movements across various wilayats and governorates of the Sultanate. The board also includes some of my contributions as the Director of the Urban Design Office at the Diwan of Royal Court, most notably the Fish Market and Sohar Market...",
        imagePath: "/images/museum/halls/Living room.jpeg",
        order: 1,
        published: true,
      },
    }),
    prisma.museumHall.upsert({
      where: { slug: "documents" },
      update: {},
      create: {
        slug: "documents",
        titleAr: "قسم الوثائق",
        titleEn: "Documents Section",
        descriptionAr: "مراسلات و تهنئات بين المغفور له أحمد نوروك و بعض القادة و المستشارين في السبعينات.",
        descriptionEn: "Correspondence and greetings between the late Ahmed Norouk and various leaders in the 70s.",
        longDescriptionAr: "يحتوي قسم على المراسلات و التهنئات بين المغفور له بإذن الله - أحمد نوروك، و بعضاً من القادة و المستشارين و الأشخاص ذوي النفوذ القوي في السبعينات و الثمانينات. من أبرزها، تهنئة لعيد الفطر السعيد عام 1968 ميلادي من المقدّم ليسيل تشونسي، الذي كان المستشار الشخصي للسلطان سعيد بن تيمور - رحمه الله...",
        longDescriptionEn: "This section contains correspondence and greetings between the late Ahmed Norouk and various leaders, advisors, and influential figures in the seventies and eighties. Notably, an Eid Al-Fitr greeting from 1968 by Lieutenant Colonel Leslie Chauncy, who was the personal advisor to Sultan Said bin Taimur, may God have mercy on him...",
        imagePath: "/images/museum/halls/Documents.jpeg",
        order: 2,
        published: true,
      },
    }),
    prisma.museumHall.upsert({
      where: { slug: "ahmed-norouk" },
      update: {},
      create: {
        slug: "ahmed-norouk",
        titleAr: "غرفة أحمد نوروك",
        titleEn: "Ahmed Norouk's Room",
        descriptionAr: "المستلزمات الخاصة التي كان يستخدمها والدي أحمد نوروك في فترة حياته و عمله.",
        descriptionEn: "The personal belongings used by my father, Ahmed Norouk, during his lifetime and career.",
        longDescriptionAr: "تحتوي هذه الغرفة على المستلزمات الخاصة التي كان يستخدمها والدي أحمد نوروك في فترة حياته. و من أبرز مكوّنات الغرفة الحقيبة الخاصة التي كان يستخدمها للتنقّل و توصيل أجور (رواتب) العاملين في مختلف المناطق، و أيضاً المستندات الخاصة بالعمل كونه أمين جمركي في منطقة أسود. أيضاً، تتواجد آلة الطباعة القديمة، عطو أمواج بالإصدار و الزجاجة القديمة، و تشكيلة المسابيح و الكتب المتنوّعة.",
        longDescriptionEn: "This room contains the personal belongings used by my father, Ahmed Norouk, during his lifetime. Prominent items include the special briefcase he used to travel and deliver wages to workers, as well as work documents from his time as a customs trustee in Aswad. It also features an old typewriter, vintage Amouage perfume, and a varied collection of rosaries and books.",
        imagePath: "/images/museum/halls/Ahmed norok 1.jpeg",
        order: 3,
        published: true,
      },
    }),
    prisma.museumHall.upsert({
      where: { slug: "azza-mubarak" },
      update: {},
      create: {
        slug: "azza-mubarak",
        titleAr: "غرفة عزه مبارك",
        titleEn: "Azza Mubarak's Room",
        descriptionAr: "تمثّل الغرفة العدّة الأساسية للمرأة العمانية من الستينات إلى التسعينات.",
        descriptionEn: "The room represents the essential toolkit of Omani women from the 60s to the 90s.",
        longDescriptionAr: "عزه مبارك هي والدتي، و زوجة والدي أحمد نوروك، رحمهم الله جميعاً. تمثّل غرفة عزه مبارك العدّة الأساسية للمرأة العمانية آنذاك، من الستينات و إلى التسعينات. و من هذه المستلزمات هي عدة الخياطة، المقشبة التقليدية المصنوعة من الخوص، المبخرة ذات الشكل الهرمي، مستلزمات النظافة الشخصية و العناية بالجسم (صابون لوكس - كريم نيڤيا)، و غيرها. كما تحتوي الغرفة على بعض حضور و تواجد المرأة العمانية عبر التاريخ، مثل السيدة الجليلة عهد البوسعيدية، ضريح بيبي مريم، و الملكة شمسه...",
        longDescriptionEn: "Azza Mubarak is my mother and the wife of my father, Ahmed Norouk, may God have mercy on them both. This room represents the essential toolkit of Omani women at the time, from the sixties to the nineties. Supplies include sewing kits, traditional woven fans, pyramid-shaped incense burners, and personal care products. The room also highlights the presence of Omani women throughout history, such as the Honorable Lady Ahad Al Busaidiyah, Bibi Maryam's Mausoleum, and Queen Shamsa...",
        imagePath: "/images/museum/halls/Azaa Room.jpeg",
        order: 4,
        published: true,
      },
    }),
    prisma.museumHall.upsert({
      where: { slug: "sultans" },
      update: {},
      create: {
        slug: "sultans",
        titleAr: "حجرة السلاطين",
        titleEn: "Sultans' Room",
        descriptionAr: "تتضمّن هذه الغرفة تاريخ سلاطين عمان عبر الأزمنة و إسهاماتهم المختلفة.",
        descriptionEn: "This room encompasses the history of Oman's Sultans across ages and their contributions.",
        longDescriptionAr: "تتضمّن هذه الغرفة تاريخ سلاطين عمان عبر الأزمنة، و إسهاماتهم المختلفة في إبراز عُمان عبر العصور. تحتوي الغرفة أيضاً على صور حصرية من عصر النهضة بقيادة السلطان قابوس - طيّب الله ثراه، و صور عن السلطان هيثم حفظه الله و ورعاه، قائد النهضة المتجددة...",
        longDescriptionEn: "This room encompasses the history of Oman's Sultans across ages and their various contributions to highlighting Oman throughout eras. The room also features exclusive photos from the Renaissance era led by the late Sultan Qaboos, and photos of Sultan Haitham, the leader of the renewed Renaissance...",
        imagePath: "/images/museum/halls/sultan room1.jpeg",
        order: 5,
        published: true,
      },
    }),
    prisma.museumHall.upsert({
      where: { slug: "world" },
      update: {},
      create: {
        slug: "world",
        titleAr: "غرفة العالم",
        titleEn: "World Room",
        descriptionAr: "تجميعات متنوّعة من حول العالم من شتّى المجالات بناءً على هواية جمع الطوابع والمقتنيات.",
        descriptionEn: "Diverse collections from around the world across various fields.",
        longDescriptionAr: "نابعة من اهتمامي و هوايتي بتجميع الطوابع و المقتنيات المميزة، تحتوي هذي الغرفة على تجميعات متنوّعة من حول العالم، من شتّى المجالات، منها: الرياضة - الطيور - الاكسبو - العملات النقدية و غيرها...",
        longDescriptionEn: "Stemming from my interest and hobby in collecting stamps and distinct collectibles, this room contains diverse collections from around the world across various fields, including: sports, birds, expos, coins, and more...",
        imagePath: "/images/museum/halls/world room1.jpeg",
        order: 6,
        published: true,
      },
    }),
  ]);
  console.log(`   ✓ Created ${halls.length} museum halls`);

  // ─── 3. Create Collection Categories ────────────────
  console.log("\n📂 Creating collection categories...");
  const categories = await Promise.all([
    prisma.collectionCategory.upsert({
      where: { slug: "stamps" },
      update: {},
      create: { nameAr: "الطوابع", nameEn: "Stamps", slug: "stamps" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "coins" },
      update: {},
      create: { nameAr: "العملات", nameEn: "Coins", slug: "coins" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "documents" },
      update: {},
      create: { nameAr: "الوثائق", nameEn: "Documents", slug: "documents" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "rare-photos" },
      update: {},
      create: { nameAr: "صور نادرة", nameEn: "Rare Photos", slug: "rare-photos" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "old-furniture" },
      update: {},
      create: { nameAr: "الأثاث القديم", nameEn: "Old Furniture", slug: "old-furniture" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "sewing-tools" },
      update: {},
      create: { nameAr: "أدوات الخياطة والحرف النسائية", nameEn: "Sewing and Women's Tools", slug: "sewing-tools" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "family-items" },
      update: {},
      create: { nameAr: "مقتنيات عائلية", nameEn: "Family Items", slug: "family-items" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "sultanate-memorabilia" },
      update: {},
      create: { nameAr: "تذكارات سلطانية", nameEn: "Royal/Sultanate Memorabilia", slug: "sultanate-memorabilia" },
    }),
    prisma.collectionCategory.upsert({
      where: { slug: "global-items" },
      update: {},
      create: { nameAr: "مقتنيات عالمية", nameEn: "Global Items", slug: "global-items" },
    }),
  ]);
  console.log(`   ✓ Created ${categories.length} categories`);

  // ─── 4. Create Collection Items ─────────────────────
  console.log("\n🏺 Creating collection items...");
  const stampsCat = categories[0];
  const coinsCat = categories[1];
  const docsCat = categories[2];
  const photosCat = categories[3];
  const furnitureCat = categories[4];
  const sewingCat = categories[5];
  const familyCat = categories[6];
  const sultanateCat = categories[7];
  const globalCat = categories[8];

  const loungeHall = halls[0];
  const docsHall = halls[1];
  const ahmedHall = halls[2];
  const azzaHall = halls[3];
  const sultanateHall = halls[4];
  const globalHall = halls[5];

  const items = await Promise.all([
    prisma.collectionItem.create({
      data: {
        titleAr: "مجموعة طوابع عمانية نادرة",
        titleEn: "Rare Omani Stamp Collection",
        descriptionAr: "مجموعة من الطوابع البريدية العمانية النادرة من فترات زمنية مختلفة.",
        descriptionEn: "A collection of rare Omani postal stamps from various historical periods.",
        categoryId: stampsCat.id,
        hallId: globalHall.id,
        period: "1970s-1990s",
        imagePath: "/images/museum/placeholders/collection-stamps.jpg",
        condition: "جيدة جداً / Very Good",
        historicalNoteAr: "تعكس هذه الطوابع مراحل مختلفة من تاريخ البريد في سلطنة عُمان.",
        historicalNoteEn: "These stamps reflect different stages in the postal history of the Sultanate of Oman.",
        featured: true,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "عملات عمانية تاريخية",
        titleEn: "Historical Omani Coins",
        descriptionAr: "مجموعة من العملات المعدنية العمانية القديمة.",
        descriptionEn: "A collection of old Omani metal coins.",
        categoryId: coinsCat.id,
        hallId: globalHall.id,
        period: "19th-20th century",
        imagePath: "/images/museum/placeholders/collection-coins.jpg",
        condition: "جيدة / Good",
        historicalNoteAr: "تمثل هذه العملات جزءاً من التاريخ الاقتصادي لعُمان.",
        historicalNoteEn: "These coins represent part of the economic history of Oman.",
        featured: true,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "وثيقة تجارية تاريخية",
        titleEn: "Historical Trade Document",
        descriptionAr: "وثيقة تجارية قديمة تعكس النشاط التجاري في صحار.",
        descriptionEn: "An old trade document reflecting commercial activity in Sohar.",
        categoryId: docsCat.id,
        hallId: docsHall.id,
        period: "Early 20th century",
        imagePath: "/images/museum/placeholders/collection-documents.jpg",
        condition: "مقبولة / Acceptable",
        historicalNoteAr: "تُظهر هذه الوثيقة جانباً من الحياة التجارية في مدينة صحار.",
        historicalNoteEn: "This document shows an aspect of commercial life in the city of Sohar.",
        featured: false,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "صورة نادرة لصحار القديمة",
        titleEn: "Rare Photo of Old Sohar",
        descriptionAr: "صورة فوتوغرافية نادرة تُظهر معالم مدينة صحار في فترة سابقة.",
        descriptionEn: "A rare photograph showing landmarks of the city of Sohar from an earlier period.",
        categoryId: photosCat.id,
        hallId: loungeHall.id,
        period: "Mid-20th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "جيدة / Good",
        historicalNoteAr: "تعتبر هذه الصورة من الوثائق البصرية المهمة لتاريخ مدينة صحار.",
        historicalNoteEn: "This photograph is considered an important visual document of the history of Sohar.",
        featured: true,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "صندوق خشبي عماني تقليدي",
        titleEn: "Traditional Omani Wooden Chest",
        descriptionAr: "صندوق خشبي مزخرف كان يُستخدم لحفظ المقتنيات الشخصية.",
        descriptionEn: "An ornate wooden chest used for storing personal belongings.",
        categoryId: furnitureCat.id,
        hallId: loungeHall.id,
        period: "19th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "جيدة / Good",
        historicalNoteAr: "يعكس هذا الصندوق مهارة الحرفيين العمانيين في النجارة والزخرفة.",
        historicalNoteEn: "This chest reflects the skill of Omani craftsmen in carpentry and ornamentation.",
        featured: false,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "أدوات خياطة تراثية",
        titleEn: "Heritage Sewing Tools",
        descriptionAr: "مجموعة من أدوات الخياطة والتطريز التقليدية.",
        descriptionEn: "A collection of traditional sewing and embroidery tools.",
        categoryId: sewingCat.id,
        hallId: azzaHall.id,
        period: "Early-mid 20th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "جيدة جداً / Very Good",
        historicalNoteAr: "تمثل هذه الأدوات جزءاً من التراث الحرفي للمرأة العمانية.",
        historicalNoteEn: "These tools represent part of the craft heritage of Omani women.",
        featured: true,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "مقتنيات عائلية تاريخية",
        titleEn: "Historical Family Belongings",
        descriptionAr: "مجموعة من المقتنيات الشخصية والعائلية التي تعكس الحياة اليومية.",
        descriptionEn: "A collection of personal and family belongings reflecting daily life.",
        categoryId: familyCat.id,
        hallId: ahmedHall.id,
        period: "20th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "جيدة / Good",
        historicalNoteAr: "تقدم هذه المقتنيات نظرة على الحياة اليومية للعائلة العمانية.",
        historicalNoteEn: "These belongings offer a glimpse into the daily life of an Omani family.",
        featured: false,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "تذكار سلطاني",
        titleEn: "Sultanate Memorabilia",
        descriptionAr: "قطعة تذكارية تتعلق بتاريخ السلطنة.",
        descriptionEn: "A memorabilia piece related to the history of the Sultanate.",
        categoryId: sultanateCat.id,
        hallId: sultanateHall.id,
        period: "Late 20th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "ممتازة / Excellent",
        historicalNoteAr: "تعكس هذه القطعة جانباً من التاريخ الرسمي لسلطنة عمان.",
        historicalNoteEn: "This piece reflects an aspect of the official history of the Sultanate of Oman.",
        featured: true,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "قطعة فنية عالمية",
        titleEn: "Global Art Piece",
        descriptionAr: "قطعة فنية أو تذكارية من دولة أخرى ضمن المجموعة العالمية.",
        descriptionEn: "An art or memorabilia piece from another country in the global collection.",
        categoryId: globalCat.id,
        hallId: globalHall.id,
        period: "20th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "جيدة / Good",
        historicalNoteAr: "تعكس هذه القطعة العلاقات الثقافية لعُمان مع دول العالم.",
        historicalNoteEn: "This piece reflects Oman's cultural relations with countries around the world.",
        featured: false,
        published: true,
      },
    }),
    prisma.collectionItem.create({
      data: {
        titleAr: "مخطوطة تاريخية",
        titleEn: "Historical Manuscript",
        descriptionAr: "مخطوطة قديمة تحتوي على نصوص تاريخية ذات قيمة ثقافية.",
        descriptionEn: "An old manuscript containing historical texts of cultural value.",
        categoryId: docsCat.id,
        hallId: docsHall.id,
        period: "18th-19th century",
        imagePath: "/images/museum/placeholders/item-default.jpg",
        condition: "مقبولة / Acceptable",
        historicalNoteAr: "تُعد هذه المخطوطة من القطع النادرة في المجموعة.",
        historicalNoteEn: "This manuscript is considered one of the rare pieces in the collection.",
        featured: true,
        published: true,
      },
    }),
  ]);
  console.log(`   ✓ Created ${items.length} collection items`);

  // ─── 5. Create News/Events ──────────────────────────
  console.log("\n📰 Creating news and events...");
  const newsEvents = await Promise.all([
    prisma.newsEvent.upsert({
      where: { slug: "museum-digital-archive-launch" },
      update: {},
      create: {
        slug: "museum-digital-archive-launch",
        titleAr: "إطلاق الأرشيف الرقمي لمتحف بن نوروك",
        titleEn: "Launch of Bin Norouk Museum Digital Archive",
        excerptAr: "يعلن متحف بن نوروك عن إطلاق منصته الرقمية لعرض مقتنياته التراثية.",
        excerptEn: "Bin Norouk Museum announces the launch of its digital platform to showcase its heritage collection.",
        contentAr: "في إطار سعي متحف بن نوروك للحفاظ على التراث العماني ونشره رقمياً، يسر المتحف الإعلان عن إطلاق أرشيفه الرقمي. يتيح هذا الأرشيف للزوار استكشاف مقتنيات المتحف عبر الإنترنت، مما يوسع نطاق الوصول إلى هذا التراث الثقافي الغني.",
        contentEn: "As part of Bin Norouk Museum's efforts to preserve and digitally disseminate Omani heritage, the museum is pleased to announce the launch of its digital archive. This archive allows visitors to explore the museum's collections online, expanding access to this rich cultural heritage.",
        type: NewsEventType.NEWS,
        featured: true,
        published: true,
      },
    }),
    prisma.newsEvent.upsert({
      where: { slug: "heritage-education-workshop" },
      update: {},
      create: {
        slug: "heritage-education-workshop",
        titleAr: "ورشة عمل تعليمية حول التراث العماني",
        titleEn: "Educational Workshop on Omani Heritage",
        excerptAr: "ينظم المتحف ورشة عمل تعليمية للطلاب حول أهمية الحفاظ على التراث.",
        excerptEn: "The museum organizes an educational workshop for students on the importance of heritage preservation.",
        contentAr: "يستضيف متحف بن نوروك ورشة عمل تعليمية تستهدف طلاب المدارس والجامعات. تهدف الورشة إلى تعريف المشاركين بأهمية الحفاظ على التراث الثقافي وطرق توثيقه وصيانته. تتضمن الورشة جولة في قاعات المتحف وأنشطة تفاعلية.",
        contentEn: "Bin Norouk Museum hosts an educational workshop targeting school and university students. The workshop aims to introduce participants to the importance of cultural heritage preservation and methods of documentation and conservation. The workshop includes a tour of the museum halls and interactive activities.",
        type: NewsEventType.EVENT,
        eventDate: new Date("2025-03-15"),
        featured: true,
        published: true,
      },
    }),
    prisma.newsEvent.upsert({
      where: { slug: "new-coin-collection-exhibit" },
      update: {},
      create: {
        slug: "new-coin-collection-exhibit",
        titleAr: "معرض جديد لمجموعة العملات النادرة",
        titleEn: "New Exhibition of Rare Coin Collection",
        excerptAr: "يكشف المتحف عن معرض جديد يضم مجموعة من العملات النادرة.",
        excerptEn: "The museum unveils a new exhibition featuring a collection of rare coins.",
        contentAr: "يفتتح متحف بن نوروك معرضاً جديداً يضم مجموعة مختارة من العملات المعدنية النادرة. يشمل المعرض عملات من فترات تاريخية مختلفة، تعكس التطور الاقتصادي والتجاري لسلطنة عمان والمنطقة.",
        contentEn: "Bin Norouk Museum opens a new exhibition featuring a selected collection of rare metal coins. The exhibition includes coins from different historical periods, reflecting the economic and commercial development of the Sultanate of Oman and the region.",
        type: NewsEventType.NEWS,
        featured: false,
        published: true,
      },
    }),
  ]);
  console.log(`   ✓ Created ${newsEvents.length} news/events`);

  // ─── 6. Create Site Settings ────────────────────────
  console.log("\n⚙️  Creating site settings...");
  const settings = [
    { key: "phone", valueAr: "+968 XXXX XXXX", valueEn: "+968 XXXX XXXX" },
    { key: "whatsapp", valueAr: "+968 XXXX XXXX", valueEn: "+968 XXXX XXXX" },
    { key: "email", valueAr: "info@example.com", valueEn: "info@example.com" },
    { key: "address", valueAr: "صحار، شمال الباطنة، سلطنة عُمان", valueEn: "Sohar, North Al Batinah, Oman" },
    { key: "opening_hours", valueAr: "سيتم التحديث من قبل إدارة المتحف", valueEn: "To be updated by museum admin" },
    { key: "hero_title", valueAr: "متحف بن نوروك | ذاكرة صحار وتراث البيت العماني", valueEn: "Bin Norouk Museum | Memory of Sohar and Omani Heritage" },
    { key: "hero_subtitle", valueAr: "نحفظ الذاكرة العمانية من وثائق وصور وعملات وطوابع وتراث عائلي", valueEn: "Preserving Omani memory through documents, photos, coins, stamps, and family heritage" },
    { key: "facebook", valueAr: "#", valueEn: "#" },
    { key: "instagram", valueAr: "#", valueEn: "#" },
    { key: "twitter", valueAr: "#", valueEn: "#" },
    { key: "youtube", valueAr: "#", valueEn: "#" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`   ✓ Created ${settings.length} site settings`);

  console.log("\n✅ Database seeding completed successfully!");
  console.log("\n📋 Admin credentials (for local development only):");
  console.log("   Email: admin@binnorouk.museum");
  console.log("   Password: MuseumAdmin2024!");
  console.log("\n⚠️  Change these credentials in production!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
