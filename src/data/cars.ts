import { Car, ProtectionPlan, AddonOption } from '../types';

export const CARS_DATA: Car[] = [
  {
    id: 'car-s500',
    name: { ar: 'مرسيدس-بنز S500 ليموزين 2025', en: 'Mercedes-Benz S500 Limousine 2025' },
    brand: 'Mercedes-Benz',
    modelYear: 2025,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 1850,
    weeklyPrice: 11800,
    monthlyPrice: 39000,
    seats: 5,
    luggage: 4,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.0L Turbo Inline-6 EQ Boost 429 HP',
    features: {
      ar: ['مقاعد خلفية من الدرجة الأولى VIP مع تدليك وتدفئة وتبريد', 'نظام صوتي Burmester High-End 4D', 'شاشات ترفيه خلفية مستقلة MBUX', 'توجيه المحور الخلفي ونظام تعليق هوائي AIRMATIC', 'شاشة عرض على الزجاج HUD ثلاثية الأبعاد'],
      en: ['First-Class Rear Executive Seats with Massage & Cooling', 'Burmester High-End 4D Surround Sound', 'Dual Rear MBUX Entertainment Tablets', 'Rear-Axle Steering & AIRMATIC Air Suspension', 'Augmented Reality 3D Head-Up Display']
    },
    isPopular: true,
    isSpecialOffer: true,
    discountPercentage: 10,
    availableQuantity: 4,
    minDriverAge: 25,
    depositRequired: 5000,
    includedMileagePerDay: 250
  },
  {
    id: 'car-escalade',
    name: { ar: 'كاديلاك إسكاليد بلاتينيوم 2025 V8', en: 'Cadillac Escalade Platinum 2025 V8' },
    brand: 'Cadillac',
    modelYear: 2025,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 1650,
    weeklyPrice: 10500,
    monthlyPrice: 36000,
    seats: 7,
    luggage: 6,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '6.2L V8 EcoTec3 420 HP',
    features: {
      ar: ['شاشة OLED منحنية مقاس 38 بوصة بدقة 4K', 'نظام صوتي استوديو AKG بـ 36 مكبر صوت', 'أبواب شفط إلكترونية وثلاجة تبريد مدمجة', 'رؤية ليلية بالأشعة تحت الحمراء ونظام تثبيت سرعة فائق', 'دفع رباعي مستمر مع تعليق هوائي متكيف'],
      en: ['Curved 38-inch 4K OLED Display', 'AKG Studio 36-Speaker Reference Sound', 'Soft-Close Doors & Center Console Cooler', 'Night Vision Infrared & Super Cruise', 'Full-Time 4WD with Adaptive Air Ride']
    },
    isPopular: true,
    availableQuantity: 5,
    minDriverAge: 25,
    depositRequired: 4000,
    includedMileagePerDay: 300
  },
  {
    id: 'car-porsche-911',
    name: { ar: 'بورش 911 كاريرا GTS 2025', en: 'Porsche 911 Carrera GTS 2025' },
    brand: 'Porsche',
    modelYear: 2025,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 2200,
    weeklyPrice: 14000,
    monthlyPrice: 48000,
    seats: 2,
    luggage: 2,
    doors: 2,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.0L Twin-Turbo Flat-6 473 HP',
    features: {
      ar: ['تسارع من 0 إلى 100 كم/س خلال 3.3 ثانية', 'باقة Sport Chrono مع عادم رياضي نشط', 'مكابح كربون سيراميك PCCB', 'نظام صوتي فاخر من BOSE', 'عجلات GTS رياضية بقفل مركزي'],
      en: ['0-100 km/h in 3.3 seconds', 'Sport Chrono Package with Active Sports Exhaust', 'Porsche Ceramic Composite Brakes (PCCB)', 'BOSE Surround Sound System', 'Center-Locking Lightweight GTS Wheels']
    },
    isSpecialOffer: true,
    discountPercentage: 15,
    availableQuantity: 2,
    minDriverAge: 25,
    depositRequired: 6000,
    includedMileagePerDay: 200
  },
  {
    id: 'car-bmw-7',
    name: { ar: 'بي إم دبليو الفئة السابعة 735i M-Sport 2025', en: 'BMW 7-Series 735i M-Sport 2025' },
    brand: 'BMW',
    modelYear: 2025,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 1500,
    weeklyPrice: 9600,
    monthlyPrice: 32500,
    seats: 5,
    luggage: 4,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.0L TwinPower Turbo Mild Hybrid 286 HP',
    features: {
      ar: ['شاشة السينما الخلفية BMW Theatre Screen مقاس 31.3 بوصة 8K', 'أبواب أوتوماتيكية تفتح وتغلق باللمس', 'نظام Bowers & Wilkins Diamond الصوتي المحيطي', 'إضاءة محيطية تفاعلية Interaction Bar', 'سقف بانورامي بإضاءة LED Sky Lounge'],
      en: ['31.3" 8K BMW Rear Theatre Screen', 'Automatic Touchless Power Doors', 'Bowers & Wilkins Diamond Surround Sound', 'Dynamic BMW Interaction Bar', 'Sky Lounge Panoramic Glass Sunroof']
    },
    isPopular: true,
    availableQuantity: 4,
    minDriverAge: 25,
    depositRequired: 4000,
    includedMileagePerDay: 250
  },
  {
    id: 'car-landcruiser',
    name: { ar: 'تويوتا لاندكروزر VXR 2025 توين تيربو', en: 'Toyota Land Cruiser VXR 2025 Twin-Turbo' },
    brand: 'Toyota',
    modelYear: 2025,
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 790,
    weeklyPrice: 5100,
    monthlyPrice: 17500,
    seats: 7,
    luggage: 5,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.5L Twin-Turbo V6 409 HP',
    features: {
      ar: ['دفع رباعي مستمر مع نظام الزحف واختيار التضاريس MTS', 'مقاعد جلد فاخرة مع تبريد وتدفئة لجميع الصفوف', 'نظام صوتي JBL بـ 14 سماعة', 'شاشة ملاحة 12.3 بوصة وشاشات خلفية', 'ثلاجة مدمجة وفتحة سقف'],
      en: ['Full-Time 4WD with Multi-Terrain Select & Crawl', 'Premium Leather with Multi-Row Climate Seats', 'JBL 14-Speaker Audio', '12.3" Nav Display & Dual Rear Entertainment', 'Integrated Cool Box & Sunroof']
    },
    isPopular: true,
    availableQuantity: 8,
    minDriverAge: 25,
    depositRequired: 2000,
    includedMileagePerDay: 350
  },
  {
    id: 'car-patrol',
    name: { ar: 'نيسان باترول تيتانيوم V8 2025 (بطل الدروب)', en: 'Nissan Patrol Titanium V8 2025' },
    brand: 'Nissan',
    modelYear: 2025,
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 650,
    weeklyPrice: 4200,
    monthlyPrice: 14500,
    seats: 8,
    luggage: 5,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '5.6L V8 400 HP',
    features: {
      ar: ['محرك V8 جبار 400 حصان', 'نظام التحكم الهيدروليكي بحركة هيكل السيارة HBMC', 'نظام Bose Premium الصوتي بـ 13 مكبر صوت', '8 مقاعد رحبة مناسبة للسفر والعائلات', 'تشغيل المحرك عن بعد'],
      en: ['Potent 5.6L 400 HP V8 Powertrain', 'Hydraulic Body Motion Control (HBMC)', 'Bose 13-Speaker Acoustic System', '8 Generous Travel Seats', 'Remote Engine Starter']
    },
    isPopular: true,
    availableQuantity: 10,
    minDriverAge: 25,
    depositRequired: 1800,
    includedMileagePerDay: 350
  },
  {
    id: 'car-yukon',
    name: { ar: 'جي إم سي يوكن دينالي 2025 V8', en: 'GMC Yukon Denali 2025 V8' },
    brand: 'GMC',
    modelYear: 2025,
    category: 'family',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 720,
    weeklyPrice: 4600,
    monthlyPrice: 15800,
    seats: 8,
    luggage: 6,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '6.2L EcoTec3 V8 420 HP',
    features: {
      ar: ['فخامة دينالي الحصرية مع مقاعد جلد مطرزة', 'نظام تعليق هوائي Air Ride المتكيف', 'نظام صوتي Bose Performance بـ 14 سماعة', 'كونسول وسطي منزلق كهربائياً', 'كاميرات بزاوية رؤية 360 درجة عالية الدقة'],
      en: ['Exclusive Denali Luxury Trim', 'Adaptive Air Ride Four-Corner Suspension', 'Bose 14-Speaker Audio', 'Power-Sliding Center Console', 'High-Def 360 Surround Cameras']
    },
    isPopular: true,
    availableQuantity: 7,
    minDriverAge: 25,
    depositRequired: 2000,
    includedMileagePerDay: 350
  },
  {
    id: 'car-tahoe',
    name: { ar: 'شفروليه تاهو LT 2025 V8', en: 'Chevrolet Tahoe LT 2025 V8' },
    brand: 'Chevrolet',
    modelYear: 2025,
    category: 'family',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 580,
    weeklyPrice: 3800,
    monthlyPrice: 12500,
    seats: 8,
    luggage: 6,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '5.3L EcoTec3 V8 355 HP',
    features: {
      ar: ['8 مقاعد عائلية فاخرة', 'محرك V8 جبار', 'نظام ترفيه خلفي لشاشات الركاب', 'تعليق مريح جداً وعزل صوتي فائق', 'أمان عالي مع مكابح الطوارئ التلقائية'],
      en: ['8 Luxury Family Seats', 'Powerful V8 Engine', 'Rear Entertainment System', 'Smooth Suspension & Acoustic Soundproofing', 'Advanced Automatic Emergency Braking']
    },
    isPopular: true,
    availableQuantity: 10,
    minDriverAge: 25,
    depositRequired: 1500,
    includedMileagePerDay: 400
  },
  {
    id: 'car-prado',
    name: { ar: 'تويوتا لاندكروزر برادو TXL 2025 الجديدة كلياً', en: 'All-New Toyota Prado TXL 2025' },
    brand: 'Toyota',
    modelYear: 2025,
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 490,
    weeklyPrice: 3200,
    monthlyPrice: 10800,
    seats: 7,
    luggage: 5,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '2.4L Turbo 4WD 281 HP',
    features: {
      ar: ['تصميم أيقوني عصري جديد كلياً', '7 مقاعد رحبة', 'دفع رباعي ذكي وقفل دفرنس مركزي وخلفي', 'شاشة لمس 12.3 بوصة ونظام صوتي مميز', 'ثلاجة مدمجة وشاحن لاسلكي'],
      en: ['All-New Iconic Design', '7 Spacious Seats', 'Smart 4WD with Center & Rear Diff Lock', '12.3" Touchscreen & Premium Audio', 'Cool Box & Qi Wireless Charger']
    },
    isSpecialOffer: true,
    discountPercentage: 10,
    availableQuantity: 8,
    minDriverAge: 23,
    depositRequired: 1200,
    includedMileagePerDay: 350
  },
  {
    id: 'car-lexus-es',
    name: { ar: 'لكزس ES 350 فخامة 2025 V6', en: 'Lexus ES 350 Luxury 2025 V6' },
    brand: 'Lexus',
    modelYear: 2025,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 450,
    weeklyPrice: 2950,
    monthlyPrice: 9900,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.5L V6 302 HP',
    features: {
      ar: ['فخامة يابانية أصيلة وعزل صوتي لا يضاهى', 'نظام Mark Levinson الصوتي النقي بـ 17 مكبر صوت', 'جلد سيمي أنيلين فاخر وتطعيمات خشب شيماموكو', 'ستائر خلفية كهربائية وتبريد المقاعد', 'شاشة ملاحة ونظام أمان لكزس LSS+ 2.5'],
      en: ['Authentic Japanese Luxury & Whisper-Quiet Cabin', 'Mark Levinson 17-Speaker Pure Audio', 'Semi-Aniline Leather & Shimamoku Wood', 'Power Sunshades & Multi-Level Ventilated Seats', 'Lexus Safety System+ 2.5']
    },
    isPopular: true,
    availableQuantity: 6,
    minDriverAge: 25,
    depositRequired: 1500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-camry',
    name: { ar: 'تويوتا كامري قراندي 2025 هايبرد', en: 'Toyota Camry Grande 2025 Hybrid' },
    brand: 'Toyota',
    modelYear: 2025,
    category: 'sedan',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 210,
    weeklyPrice: 1350,
    monthlyPrice: 4400,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: 'auto',
    fuelType: 'hybrid',
    engineCapacity: '2.5L 5th Gen HEV (26.0 كم/لتر)',
    features: {
      ar: ['محرك هايبرد الجيل الخامس فائق الاقتصاد والقوة', 'رادار ومثبت سرعة تكيفي ونظام تتبع المسار', 'مقاعد جلد فاخرة مع تبريد كهربائي', 'نظام صوتي فاخر JBL وشاحن لاسلكي', 'شاشة عرض على الزجاج الأمامي HUD'],
      en: ['5th Gen Hybrid Powertrain (26.0 km/L)', 'Full-Speed Radar & Lane Tracing Assist', 'Ventilated Power Leather Seats', 'Premium JBL Audio & Qi Charger', 'Head-Up Display (HUD)']
    },
    isPopular: true,
    availableQuantity: 20,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-tucson',
    name: { ar: 'هيونداي توسان سمارت 2025 AWD', en: 'Hyundai Tucson Smart 2025 AWD' },
    brand: 'Hyundai',
    modelYear: 2025,
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 220,
    weeklyPrice: 1400,
    monthlyPrice: 4600,
    seats: 5,
    luggage: 4,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '2.0L SmartStream AWD',
    features: {
      ar: ['دفع كلي مستمر AWD', 'صندوق أمتعة كهربائي ذكي', 'حساسات أمامية وخلفية وكاميرا رؤية محيطية', 'شاشتين رقميتين متصلتين 10.25 بوصة', 'دخول ذكي وتشغيل عن بعد'],
      en: ['Full-Time HTRAC AWD', 'Smart Hands-Free Power Tailgate', 'Front & Rear Ultrasonic Sensors', 'Dual 10.25" Digital Panoramic Screens', 'Smart Keyless Entry & Remote Start']
    },
    isPopular: true,
    availableQuantity: 14,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-rav4',
    name: { ar: 'تويوتا راف فور 2025 هايبرد 4WD', en: 'Toyota RAV4 2025 Hybrid 4WD' },
    brand: 'Toyota',
    modelYear: 2025,
    category: 'suv',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 240,
    weeklyPrice: 1550,
    monthlyPrice: 4950,
    seats: 5,
    luggage: 4,
    doors: 5,
    transmission: 'auto',
    fuelType: 'hybrid',
    engineCapacity: '2.5L HEV E-Four AWD',
    features: {
      ar: ['هايبرد دفع رباعي فائق الاعتمادية وكفاءة وقود 22.2 كم/لتر', 'نظام Toyota Safety Sense لمساعدة السائق', 'شاشة ملاحة عريضة تدعم أبل كاربلاي', 'مساحة تخزين رحبة وصندوق خلفي واسع', 'إضاءة LED كاملة وجنوط ألمنيوم 18 بوصة'],
      en: ['Highly Reliable Hybrid E-Four AWD (22.2 km/L)', 'Toyota Safety Sense Package', 'Wide Screen with Wireless Apple CarPlay', 'Generous Cargo Bay & Underfloor Storage', 'Full LED Matrix Headlamps & 18" Alloys']
    },
    availableQuantity: 16,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-k5',
    name: { ar: 'كيا K5 جي تي لاين 2025', en: 'Kia K5 GT-Line 2025' },
    brand: 'Kia',
    modelYear: 2025,
    category: 'sedan',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 195,
    weeklyPrice: 1250,
    monthlyPrice: 4100,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '2.5L GDI 194 HP',
    features: {
      ar: ['تصميم رياضي فخم مع إضاءة محيطية ديناميكية', 'فتحة سقف بانوراما مزدوجة', 'رؤية محيطية 360 درجة مع مراقبة النقطة العمياء', 'شاحن لاسلكي وتكييف إلكتروني مزدوج', 'جنوط رياضية قياس 18 بوصة'],
      en: ['Striking Sporty GT Design with Dynamic Ambient Light', 'Dual Panoramic Sunroof', '360 Surround Monitor & Blind Spot Cameras', 'Dual-Zone Climate & Wireless Fast Charger', '18" Sport Cut Alloy Wheels']
    },
    availableQuantity: 12,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-elantra',
    name: { ar: 'هيونداي إلنترا سمارت بلس 2025', en: 'Hyundai Elantra Smart Plus 2025' },
    brand: 'Hyundai',
    modelYear: 2025,
    category: 'sedan',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 155,
    weeklyPrice: 980,
    monthlyPrice: 3200,
    seats: 5,
    luggage: 3,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '2.0L SmartStream MPI',
    features: {
      ar: ['فتحة سقف كهربائية', 'شاشة لمس تدعم أبل كاربلاي وأندرويد أوتو', 'شاحن لاسلكي للهواتف الذكية', 'نظام مانع التصادم ومثبت السرعة', 'مقاعد مريحة وعزل هوائي متطور'],
      en: ['Power Sunroof', 'Touchscreen with Apple CarPlay & Android Auto', 'Qi Wireless Fast Charger', 'Forward Collision Assist & Cruise Control', 'Refined Cabin with Enhanced Noise Isolation']
    },
    isPopular: true,
    availableQuantity: 15,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 350
  },
  {
    id: 'car-yaris',
    name: { ar: 'تويوتا يارس YX 2025', en: 'Toyota Yaris YX 2025' },
    brand: 'Toyota',
    modelYear: 2025,
    category: 'economy',
    image: 'https://images.unsplash.com/photo-1590362891988-372561937ff7?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 125,
    weeklyPrice: 790,
    monthlyPrice: 2550,
    seats: 5,
    luggage: 2,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '1.3L 4-Cylinder CVT (22.4 كم/لتر)',
    features: {
      ar: ['كفاءة وقود خارقة (22.4 كم/لتر)', 'كاميرا خلفية وحساسات للمساعدة في الركن', 'نظام تنبيه النقطة العمياء BSM', 'دخول ذكي وتشغيل بصمة زر', 'بلوتوث ومنفذ شحن سريع Type-C'],
      en: ['Top-Class Fuel Economy (22.4 km/L)', 'Rear Camera & Ultrasonic Parking Sensors', 'Blind Spot Monitor (BSM)', 'Smart Keyless Entry & Push-Button Start', 'Bluetooth & Fast USB-C Ports']
    },
    isSpecialOffer: true,
    discountPercentage: 15,
    availableQuantity: 24,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 300
  },
  {
    id: 'car-accent',
    name: { ar: 'هيونداي أكسنت سمارت 2025', en: 'Hyundai Accent Smart 2025' },
    brand: 'Hyundai',
    modelYear: 2025,
    category: 'economy',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 119,
    weeklyPrice: 750,
    monthlyPrice: 2450,
    seats: 5,
    luggage: 2,
    doors: 4,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '1.5L SmartStream (18.9 كم/لتر)',
    features: {
      ar: ['شاشة لمس 8 بوصة مع أبل كاربلاي وأندرويد أوتو', 'كاميرا خلفية مع خطوط توجيه تفاعلية', 'حساسات ركن خلفية ومثبت سرعة', 'موفر وقود ممتاز جداً واقتصادي', 'تكييف بارد فائق الفعالية'],
      en: ['8" Touchscreen with Apple CarPlay & Android Auto', 'Rear Camera with Dynamic Guidelines', 'Rear Parking Sensors & Cruise Control', 'Outstanding Fuel Economy', 'Powerful High-Output AC']
    },
    isPopular: true,
    availableQuantity: 18,
    minDriverAge: 21,
    depositRequired: 500,
    includedMileagePerDay: 300
  },
  {
    id: 'car-staria',
    name: { ar: 'هيونداي ستاريا VIP 2025 (9 مقاعد)', en: 'Hyundai Staria VIP 2025 (9 Seats)' },
    brand: 'Hyundai',
    modelYear: 2025,
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80',
    dailyPrice: 320,
    weeklyPrice: 2100,
    monthlyPrice: 6900,
    seats: 9,
    luggage: 6,
    doors: 5,
    transmission: 'auto',
    fuelType: 'petrol',
    engineCapacity: '3.5L V6 272 HP',
    features: {
      ar: ['9 مقاعد واسعة للرحلات العائلية ونقل الوفود والعمرة', 'أبواب جانبية كهربائية انزلاقية تفتح بلمسة', 'تكييف مركزي منفصل لكل صف ركاب', 'نوافذ بانورامية واسعة ورؤية محيطية', 'مثالية لرحلات مطارات المملكة والحرمين'],
      en: ['9 Generous Seats for Families, Umrah & Corporate VIPs', 'Dual Power Sliding Doors', 'Independent Multi-Zone Climate Controls', 'Panoramic Vista Windows', 'Ideal for Saudi Airport Transfers & Long Journeys']
    },
    availableQuantity: 9,
    minDriverAge: 23,
    depositRequired: 1000,
    includedMileagePerDay: 400
  }
];

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'basic',
    name: { ar: 'التأمين الأساسي (CDW)', en: 'Basic Protection (CDW)' },
    description: {
      ar: 'مشمول مجاناً في سعر الحجز، مع تحمل نسبي في حال وجود تقرير نجم/المرور.',
      en: 'Included free with booking, standard deductible applies with official traffic report.'
    },
    pricePerDay: 0,
    deductible: 2000,
    features: {
      ar: ['تغطية ضد الغير بنسبة 100%', 'تغطية الأضرار مع نسبة تحمل', 'مساعدة على الطريق أساسية'],
      en: ['100% Third-party liability', 'Collision damage with deductible', 'Basic roadside assistance']
    }
  },
  {
    id: 'comprehensive',
    name: { ar: 'التأمين الشامل (SCDW)', en: 'Comprehensive Protection (SCDW)' },
    description: {
      ar: 'يقلل نسبة التحمل إلى 500 ريال فقط ويشمل تغطية الزجاج والإطارات.',
      en: 'Reduces deductible to just 500 SAR and covers windshield & tire damages.'
    },
    pricePerDay: 35,
    deductible: 500,
    recommended: true,
    features: {
      ar: ['تحمل مخفض جداً (500 ريال)', 'تغطية تلفيات الزجاج والإطارات', 'سيارة بديلة مجاناً فور وقوع حادث', 'سحب ونقل المركبة مجاناً'],
      en: ['Low deductible (500 SAR)', 'Tire and windshield protection', 'Free replacement vehicle', 'Free towing and recovery']
    }
  },
  {
    id: 'super_zero',
    name: { ar: 'الحماية الفائقة (صفر تحمل)', en: 'Zero Liability Super Protection' },
    description: {
      ar: 'راحة بال تامة بدون أي مبالغ تحمل مهما كان حجم الضرر بوجود تقرير الحادث.',
      en: 'Complete peace of mind with 0 SAR deductible regardless of damages with report.'
    },
    pricePerDay: 65,
    deductible: 0,
    features: {
      ar: ['نسبة تحمل 0 ريال (إعفاء كامل)', 'تغطية شاملة لكل أنواع الأضرار', 'أولوية قصوى لخدمة المساعدة على الطريق', 'إعفاء من رسوم التوقف وتأخير الإصلاح'],
      en: ['0 SAR deductible (Zero excess)', 'Full damage waiver coverage', 'Priority VIP roadside assistance', 'No loss-of-use administrative fees']
    }
  }
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'child_seat',
    name: { ar: 'مقعد أطفال آمن', en: 'Child Safety Seat' },
    description: { ar: 'مقعد مريح ومطابق لأعلى معايير السلامة الأوروبية والأمريكية للأطفال', en: 'Comfortable, certified child safety seat meeting ISOFIX standards' },
    pricePerDay: 25,
    icon: 'Baby',
    maxQuantity: 2
  },
  {
    id: 'extra_driver',
    name: { ar: 'إضافة سائق مصرح إضافي', en: 'Additional Authorized Driver' },
    description: { ar: 'يسمح لشخص ثانٍ بقيادة السيارة مع شموله الكامل بالتغطية التأمينية', en: 'Allows a second person to drive the vehicle with full insurance coverage' },
    pricePerDay: 30,
    icon: 'UserPlus',
    maxQuantity: 2
  },
  {
    id: 'open_mileage',
    name: { ar: 'باقة الكيلومترات المفتوحة (غير محدود)', en: 'Unlimited Mileage Package' },
    description: { ar: 'تنقل بحرية مطلقة في كافة أرجاء المملكة دون أي قلق من احتساب المسافة', en: 'Drive without limits anywhere across the Kingdom with zero mileage restrictions' },
    pricePerDay: 45,
    icon: 'Gauge',
    maxQuantity: 1
  },
  {
    id: 'wifi_hotspot',
    name: { ar: 'جهاز إنترنت واي فاي محمول 5G', en: '5G Portable Pocket WiFi' },
    description: { ar: 'إنترنت 5G فائق السرعة مفتوح لربط حتى 10 أجهزة أثناء رحلتك', en: 'High-speed 5G portable internet router for up to 10 connected devices' },
    pricePerDay: 25,
    icon: 'Wifi',
    maxQuantity: 1
  },
  {
    id: 'cross_border',
    name: { ar: 'تصريح السفر لدول الخليج (GCC)', en: 'GCC Cross-Border Permit' },
    description: { ar: 'تفويض وسفر دولي للمركبة يشمل دول مجلس التعاون الخليجي مع التأمين', en: 'Official authorization and cross-border insurance permit for GCC countries' },
    pricePerDay: 50,
    icon: 'Globe',
    maxQuantity: 1
  }
];
