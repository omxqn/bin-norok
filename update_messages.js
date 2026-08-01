const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const arPath = path.join(__dirname, 'messages', 'ar.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newEnKeys = {
  "About": {
    "title": "About Bin Norouk Museum",
    "description": "Discover our story, mission, and the history behind our collection.",
    "missionTitle": "Our Mission",
    "missionDesc": "To preserve and showcase the authentic history of Sohar and Omani heritage.",
    "visionTitle": "Our Vision",
    "visionDesc": "To be the leading cultural hub in Oman, bridging the past with the future."
  },
  "Halls": {
    "title": "Museum Halls",
    "description": "Explore our diverse exhibition halls, each telling a unique story of Omani heritage.",
    "hall1": "Omani House Hall",
    "hall2": "Maritime History",
    "hall3": "Weapons & Armor",
    "hall4": "Traditional Crafts",
    "hall5": "Sohar Through Ages"
  },
  "Visit": {
    "title": "Plan Your Visit",
    "description": "Everything you need to know before visiting Bin Norouk Museum.",
    "hoursTitle": "Opening Hours",
    "hoursDesc": "Saturday to Thursday: 9:00 AM - 5:00 PM\nFriday: 1:30 PM - 6:00 PM",
    "locationTitle": "Location",
    "locationDesc": "Sohar, Sultanate of Oman",
    "bookTitle": "Book Your Tickets",
    "formName": "Full Name",
    "formEmail": "Email Address",
    "formDate": "Date of Visit",
    "formTickets": "Number of Tickets",
    "formSubmit": "Book Now"
  },
  "Contact": {
    "title": "Contact Us",
    "description": "Get in touch with us for inquiries, group bookings, or feedback.",
    "formName": "Your Name",
    "formEmail": "Your Email",
    "formMessage": "Your Message",
    "formSubmit": "Send Message"
  },
  "Collections": {
    "title": "Our Collections",
    "description": "Browse our extensive collection of historical artifacts.",
    "filterAll": "All",
    "filterWeapons": "Weapons",
    "filterJewelry": "Jewelry",
    "filterManuscripts": "Manuscripts",
    "filterPottery": "Pottery"
  },
  "VirtualTour": {
    "title": "Virtual Tour",
    "description": "Experience Bin Norouk Museum from anywhere in the world.",
    "startTour": "Start Virtual Tour"
  },
  "Education": {
    "title": "Educational Programs",
    "description": "Inspiring the next generation through interactive learning."
  },
  "Sohar": {
    "title": "Sohar Heritage",
    "description": "The deep-rooted history of Sohar, the ancient capital of Oman."
  },
  "News": {
    "title": "News & Events",
    "description": "Stay updated with the latest happenings at the museum."
  }
};

const newArKeys = {
  "About": {
    "title": "عن متحف بن نوروك",
    "description": "اكتشف قصتنا ومهمتنا والتاريخ وراء مجموعتنا.",
    "missionTitle": "مهمتنا",
    "missionDesc": "الحفاظ على التاريخ الأصيل لصحار والتراث العماني وعرضه.",
    "visionTitle": "رؤيتنا",
    "visionDesc": "أن نكون المركز الثقافي الرائد في عمان، نربط الماضي بالمستقبل."
  },
  "Halls": {
    "title": "قاعات المتحف",
    "description": "استكشف قاعات العرض المتنوعة لدينا، كل منها تروي قصة فريدة من التراث العماني.",
    "hall1": "قاعة البيت العماني",
    "hall2": "التاريخ البحري",
    "hall3": "الأسلحة والدروع",
    "hall4": "الحرف التقليدية",
    "hall5": "صحار عبر العصور"
  },
  "Visit": {
    "title": "خطط لزيارتك",
    "description": "كل ما تحتاج معرفته قبل زيارة متحف بن نوروك.",
    "hoursTitle": "ساعات العمل",
    "hoursDesc": "السبت إلى الخميس: 9:00 صباحاً - 5:00 مساءً\nالجمعة: 1:30 مساءً - 6:00 مساءً",
    "locationTitle": "الموقع",
    "locationDesc": "صحار، سلطنة عمان",
    "bookTitle": "احجز تذاكرك",
    "formName": "الاسم الكامل",
    "formEmail": "البريد الإلكتروني",
    "formDate": "تاريخ الزيارة",
    "formTickets": "عدد التذاكر",
    "formSubmit": "احجز الآن"
  },
  "Contact": {
    "title": "اتصل بنا",
    "description": "تواصل معنا للاستفسارات أو الحجوزات الجماعية أو الملاحظات.",
    "formName": "الاسم",
    "formEmail": "البريد الإلكتروني",
    "formMessage": "رسالتك",
    "formSubmit": "إرسال الرسالة"
  },
  "Collections": {
    "title": "مجموعاتنا",
    "description": "تصفح مجموعتنا الواسعة من القطع الأثرية التاريخية.",
    "filterAll": "الكل",
    "filterWeapons": "الأسلحة",
    "filterJewelry": "المجوهرات",
    "filterManuscripts": "المخطوطات",
    "filterPottery": "الفخار"
  },
  "VirtualTour": {
    "title": "الجولة الافتراضية",
    "description": "استكشف متحف بن نوروك من أي مكان في العالم.",
    "startTour": "ابدأ الجولة الافتراضية"
  },
  "Education": {
    "title": "البرامج التعليمية",
    "description": "إلهام الجيل القادم من خلال التعلم التفاعلي."
  },
  "Sohar": {
    "title": "تراث صحار",
    "description": "التاريخ العميق لصحار، العاصمة القديمة لعمان."
  },
  "News": {
    "title": "الأخبار والفعاليات",
    "description": "ابق على اطلاع بأحدث الفعاليات في المتحف."
  }
};

Object.assign(enData, newEnKeys);
// Only override English keys to Arabic keys if the AR exists or merge
// Wait, I should just reset AR data if it was mojibaked, but I don't want to lose Index/Navigation/Footer/Hero/Stats/FeaturedHalls.
// Let's rewrite the essential AR keys to fix the mojibake.
const baseArKeys = {
  "Index": {
    "title": "متحف بن نوروك | ذاكرة صحار والتراث العماني",
    "description": "اكتشف التاريخ العريق لصحار والتراث العماني الأصيل في متحف بن نوروك."
  },
  "Navigation": {
    "home": "الرئيسية",
    "about": "عن المتحف",
    "halls": "قاعات المتحف",
    "visit": "خطط لزيارتك",
    "contact": "تواصل معنا",
    "bookTickets": "احجز تذاكرك"
  },
  "Footer": {
    "description": "نحفظ التاريخ العريق لصحار والتراث العماني للأجيال القادمة.",
    "quickLinks": "روابط سريعة",
    "contact": "تواصل معنا",
    "followUs": "تابعنا",
    "rights": "جميع الحقوق محفوظة.",
    "address": "صحار، سلطنة عُمان",
    "phone": "+968 1234 5678",
    "email": "info@binnorouk.om"
  },
  "Hero": {
    "subtitle": "مرحباً بكم في",
    "title": "متحف بن نوروك",
    "description": "رحلة عبر الزمن لاكتشاف ذاكرة صحار والتراث العماني الأصيل.",
    "cta": "خطط لزيارتك",
    "secondaryCta": "استكشف القاعات"
  },
  "Stats": {
    "artifacts": "+5000",
    "artifactsLabel": "قطعة أثرية",
    "eras": "3",
    "erasLabel": "حقب تاريخية",
    "visitors": "+50K",
    "visitorsLabel": "زائر سنوياً",
    "halls": "7",
    "hallsLabel": "قاعات عرض"
  },
  "FeaturedHalls": {
    "title": "قاعات مميزة",
    "subtitle": "اكتشف أبرز معروضاتنا",
    "viewAll": "عرض جميع القاعات",
    "hall1Title": "قاعة البيت العماني",
    "hall1Desc": "تعرف على الحياة التقليدية والعمارة العمانية.",
    "hall2Title": "التاريخ البحري",
    "hall2Desc": "تاريخ صحار التجاري العريق والتراث البحري.",
    "hall3Title": "الأسلحة والدروع",
    "hall3Desc": "الأسلحة العمانية التقليدية والقطع الأثرية الدفاعية."
  }
};

const fullArData = { ...baseArKeys, ...newArKeys };

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
fs.writeFileSync(arPath, JSON.stringify(fullArData, null, 2), 'utf8');
