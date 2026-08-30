import { UsedCar, LoyaltyTier, FAQItem, SubscriptionPackage } from '../types';

export const USED_CARS_DATA: UsedCar[] = [
  {
    id: 'uc-camry-2023',
    name: { ar: 'تويوتا كامري GLX 2023', en: 'Toyota Camry GLX 2023' },
    brand: 'Toyota',
    year: 2023,
    modelYear: 2023,
    mileage: 48500,
    price: 74000,
    city: { ar: 'الرياض', en: 'Riyadh' },
    monthlyInstallment: 1280,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: 'ضمان سنة كاملة', en: '1-Year Full Warranty' },
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    specs: {
      ar: ['فحص دوري معتمد 150 نقطة', 'صيانة كاملة لدى الوكيل', 'بدون أي حوادث سابقة', 'تظليل وحماية عازلة', 'ضمان ممتد سنة كاملة'],
      en: ['150-Point Certified Inspection', 'Full Agency Service History', 'Accident Free', 'Thermal Tinting', '1-Year Full Warranty']
    },
    category: 'Sedan'
  },
  {
    id: 'uc-tucson-2023',
    name: { ar: 'هيونداي توسان سمارت 2023', en: 'Hyundai Tucson Smart 2023' },
    brand: 'Hyundai',
    year: 2023,
    modelYear: 2023,
    mileage: 52000,
    price: 78500,
    city: { ar: 'جدة', en: 'Jeddah' },
    monthlyInstallment: 1350,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: 'ضمان سنة كاملة', en: '1-Year Full Warranty' },
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    specs: {
      ar: ['فتحة سقف بانوراما', 'دفع كلي AWD', 'شاشة ذكية وكاميرا خلفية', 'حالة الوكالة شبه جديدة', 'إمكانية التقسيط الميسر'],
      en: ['Panoramic Sunroof', 'AWD System', 'Smart Touchscreen & Camera', 'Near New Condition', 'Flexible Financing Options']
    },
    category: 'SUV'
  },
  {
    id: 'uc-accent-2023',
    name: { ar: 'هيونداي أكسنت سمارت 2023', en: 'Hyundai Accent Smart 2023' },
    brand: 'Hyundai',
    year: 2023,
    modelYear: 2023,
    mileage: 61000,
    price: 43000,
    city: { ar: 'الدمام', en: 'Dammam' },
    monthlyInstallment: 740,
    inspectionPassed: true,
    warrantyMonths: 6,
    warranty: { ar: 'ضمان 6 أشهر', en: '6-Month Warranty' },
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    specs: {
      ar: ['اقتصاد وقود ممتاز', 'ناقل حركة أوتوماتيكي سلس', 'نظيفة جداً من الداخل والخارج', 'بطارية وإطارات جديدة', 'نقل ملكية فوري'],
      en: ['Superior Fuel Economy', 'Smooth Automatic Gearbox', 'Immaculate Interior/Exterior', 'Brand New Battery & Tires', 'Instant Title Transfer']
    },
    category: 'Economy'
  },
  {
    id: 'uc-prado-2022',
    name: { ar: 'تويوتا برادو TXL 2022 V6', en: 'Toyota Prado TXL 2022 V6' },
    brand: 'Toyota',
    year: 2022,
    modelYear: 2022,
    mileage: 69000,
    price: 148000,
    city: { ar: 'الرياض', en: 'Riyadh' },
    monthlyInstallment: 2550,
    inspectionPassed: true,
    warrantyMonths: 12,
    warranty: { ar: 'ضمان ممتد سنة', en: '1-Year Full Warranty' },
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    specs: {
      ar: ['محرك 6 سلندر 4.0 لتر', 'دفع رباعي مستمر ودبل خفيف وثقيل', 'مقاعد جلد وتبريد', 'ثلاجة وفتحة سقف', 'سجل صيانة وكيل عبد اللطيف جميل'],
      en: ['4.0L V6 Powertrain', 'Full-Time 4WD with Diff Lock', 'Leather Ventilated Seats', 'Cool Box & Sunroof', 'Full ALJ Agency History']
    },
    category: 'SUV'
  }
];

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'silver',
    name: { ar: 'عضوية الرفقة الفضية (Silver)', en: 'Al-Rufqah Silver Member' },
    minRentals: 0,
    qualifyingRentals: { ar: 'من أول حجز', en: 'From 1st Rental' },
    discountPercentage: 5,
    color: '#94A3B8',
    multiplier: 1,
    benefits: {
      ar: [
        'نقطة واحدة لكل 1 ريال مستأجر به',
        'خصم 5% مباشر على الإيجارات اليومية',
        'ترقية مجانية لفئة أعلى بعد 3 حجوزات',
        'أولوية حجز في مواسم الأعياد والعطلات'
      ],
      en: [
        '1 Point for every 1 SAR spent',
        'Direct 5% discount on daily rentals',
        'Complimentary category upgrade after 3 rentals',
        'Priority booking during holiday seasons'
      ]
    },
    perks: {
      ar: [
        'نقطة لكل 1 ريال مستأجر به',
        'خصم 5% مباشر على الإيجارات',
        'خدمة دعم عملاء مخصصة',
        'استبدال نقاط مع طيران الفرسان وقطاف'
      ],
      en: [
        '1 Point per 1 SAR spent',
        'Direct 5% instant discount',
        'Dedicated customer support line',
        'Redeemable with AlFursan & Qitaf'
      ]
    }
  },
  {
    id: 'gold',
    name: { ar: 'عضوية الرفقة الذهبية (Gold)', en: 'Al-Rufqah Gold Member' },
    minRentals: 5,
    qualifyingRentals: { ar: 'بعد 5 حجوزات', en: 'After 5 Rentals' },
    discountPercentage: 12,
    color: '#EAB308',
    multiplier: 1.5,
    benefits: {
      ar: [
        '1.5 نقطة لكل 1 ريال مستأجر به (50% نقاط إضافية)',
        'خصم 12% مباشر على كافة الفئات',
        'سائق إضافي مجاناً في كل حجز',
        'إعفاء كامل من رسوم استلام/تسليم المطار',
        'خدمة الاستلام السريع بدون انتظار (VIP Express)'
      ],
      en: [
        '1.5 Points per 1 SAR (50% bonus points)',
        'Direct 12% discount across all categories',
        'Free additional driver on every booking',
        'Zero airport pickup/dropoff surcharges',
        'VIP Express Counter fast-track service'
      ]
    },
    perks: {
      ar: [
        'خصم 12% دائم على كافة السيارات',
        'سائق إضافي ثانٍ مجاناً',
        'إعفاء كامل من رسوم صالات المطارات',
        'أولوية تسليم السيارة في أقل من 45 ثانية'
      ],
      en: [
        '12% instant discount on all models',
        'Free second authorized driver',
        'Zero airport terminal surcharge',
        'VIP express keyless delivery under 45s'
      ]
    }
  },
  {
    id: 'platinum',
    name: { ar: 'عضوية الرفقة البلاتينية (Platinum VIP)', en: 'Al-Rufqah Platinum VIP' },
    minRentals: 15,
    qualifyingRentals: { ar: 'بعد 15 حجزاً أو 45 يوماً', en: '15 Rentals or 45+ Days' },
    discountPercentage: 20,
    color: '#0284C7',
    multiplier: 2,
    benefits: {
      ar: [
        'نقطتان مضاعفتان لكل 1 ريال تنفقه (100% نقاط مكافأة)',
        'خصم 20% دائم على جميع سيارات الأسطول بما فيها الفاخرة',
        'ترقية مجانية مؤكدة لفئة فاخرة عند التوفر',
        'توصيل واستلام مجاني للمركبة عند باب بيتك أو مكتبك',
        'مدير حساب شخصي مخصص على مدار 24/7',
        'تأمين شامل بدون أي نسبة تحمل مجاناً'
      ],
      en: [
        'Double points (2 pts per 1 SAR spent)',
        'Permanent 20% discount on entire fleet including luxury',
        'Guaranteed complimentary category upgrade on availability',
        'Free door-to-door vehicle delivery & collection',
        'Dedicated 24/7 Personal VIP Account Concierge',
        'Free Zero-Liability Comprehensive Insurance'
      ]
    },
    perks: {
      ar: [
        'خصم 20% دائم على الأسطول بالكامل',
        'تأمين شامل وحماية فائقة (0 ريال تحمل) مجاناً',
        'توصيل واستلام مجاني للمنزل أو الفندق',
        'مدير حساب VIP متاح على مدار الساعة'
      ],
      en: [
        'Permanent 20% discount across entire fleet',
        'Complimentary Zero-Deductible Super Protection',
        'Free door-to-door vehicle handover',
        'Dedicated 24/7 VIP Concierge Manager'
      ]
    }
  }
];

export const SUBSCRIPTIONS_DATA: SubscriptionPackage[] = [
  {
    id: 'sub-economy',
    tier: { ar: 'الباقة الاقتصادية (Economy Pass)', en: 'Economy Pass' },
    monthlyPrice: 2450,
    includedKmPerMonth: 3500,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    sampleCars: {
      ar: ['هيونداي أكسنت 2025', 'تويوتا يارس 2025', 'كيا بيجاس 2025'],
      en: ['Hyundai Accent 2025', 'Toyota Yaris 2025', 'Kia Pegas 2025']
    },
    features: {
      ar: ['تأمين شامل وصيانة دورية مجانية', 'تبديل السيارة كل 6 أشهر', 'توصيل مجاني للمنزل'],
      en: ['Full insurance & scheduled maintenance', 'Swap car every 6 months', 'Free home delivery']
    }
  },
  {
    id: 'sub-sedan',
    tier: { ar: 'باقة السيدان التنفيذية (Executive Sedan)', en: 'Executive Sedan' },
    monthlyPrice: 3850,
    includedKmPerMonth: 4000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    sampleCars: {
      ar: ['تويوتا كامري 2025', 'هيونداي سوناتا 2025', 'نيسان ألتيما 2025'],
      en: ['Toyota Camry 2025', 'Hyundai Sonata 2025', 'Nissan Altima 2025']
    },
    features: {
      ar: ['تأمين شامل بدون نسبة تحمل', 'إمكانية إضافة سائق ثانٍ مجاناً', 'خدمة مساعدة طريق VIP'],
      en: ['Zero-deductible insurance', 'Free second authorized driver', 'VIP Roadside rescue']
    }
  },
  {
    id: 'sub-suv',
    tier: { ar: 'باقة العائلة والـ SUV (Family & Crossover)', en: 'Family SUV Pass' },
    monthlyPrice: 4950,
    includedKmPerMonth: 4500,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    sampleCars: {
      ar: ['هيونداي سنتافي 2025', 'تويوتا راف فور 2025', 'كيا سبورتاج 2025'],
      en: ['Hyundai Santa Fe 2025', 'Toyota RAV4 2025', 'Kia Sportage 2025']
    },
    features: {
      ar: ['سعة 7 ركاب ودفع رباعي', 'كيلومترات إضافية مرنة', 'سيارة بديلة فورية بنفس الفئة'],
      en: ['7-Seater AWD capability', 'Flexible rollover mileage', 'Immediate same-tier replacement']
    }
  },
  {
    id: 'sub-luxury',
    tier: { ar: 'باقة النخبة والفاخرة (Prestige Luxury)', en: 'Prestige Luxury' },
    monthlyPrice: 8900,
    includedKmPerMonth: 5000,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    sampleCars: {
      ar: ['مرسيدس E-Class 2025', 'بي إم دبليو الفئة الخامسة 2025', 'جينيسيس G80 2025'],
      en: ['Mercedes E-Class 2025', 'BMW 5-Series 2025', 'Genesis G80 2025']
    },
    features: {
      ar: ['تأمين VIP فائق شامل الحوادث والخدوش', 'خدمة كونسيرج وغسيل دوري مجاني', 'أولوية في أحدث الموديلات'],
      en: ['Super VIP Zero-Liability Insurance', 'Free periodic detailing & wash', 'Priority for newest arrivals']
    }
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'requirements',
    question: {
      ar: 'ما هي الوثائق والشروط المطلوبة لاستئجار سيارة في المملكة؟',
      en: 'What documents and requirements are needed to rent a car in Saudi Arabia?'
    },
    answer: {
      ar: 'للمواطنين والمقيمين: بطاقة الهوية الوطنية أو الإقامة سارية المفعول، ورخصة قيادة سعودية سارية، وألا يقل عمر المستأجر عن 21 عاماً (25 عاماً للسيارات الفاخرة والكبيرة)، وبطاقة دفع (مدى أو فيزا/ماستركارد).\n\nلزوار المملكة والخليجيين: جواز السفر مع تأشيرة الدخول، ورخصة القيادة الوطنية أو الدولية المعتمدة، وبطاقة ائتمانية.',
      en: 'For Citizens & Residents: Valid National ID or Iqama, valid Saudi Driving License, minimum age of 21 (25 for luxury/large SUVs), and valid payment card (Mada/Visa/MasterCard).\n\nFor GCC Citizens & Tourists: Valid Passport with entry stamp/visa, valid National or International Driving Permit, and valid credit card.'
    }
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: {
      ar: 'كم يستغرق استلام السيارة من الفرع أو المطار؟',
      en: 'How long does vehicle pickup take at the branch or airport?'
    },
    answer: {
      ar: 'بعد تأكيد الحجز، يتم تجهيز السيارة مسبقاً. عند وصولك إلى الفرع أو صالة المطار، يتم تسليم السيارة خلال دقائق بعد التحقق من الوثائق.',
      en: 'After confirming your booking, the vehicle is prepared in advance. Upon arrival at the branch or airport terminal, handover is completed within minutes after document verification.'
    }
  },
  {
    id: 'faq-3',
    category: 'insurance',
    question: {
      ar: 'ما الفرق بين التأمين الأساسي، الشامل، والحماية الفائقة (صفر تحمل)؟',
      en: 'What is the difference between Basic, Comprehensive, and Zero Liability protection?'
    },
    answer: {
      ar: '• التأمين الأساسي: مشمول مجاناً ويغطي المسؤولية ضد الغير مع نسبة تحمل محددة عند حدوث ضرر.\n• التأمين الشامل: يخفض نسبة التحمل إلى 500 ريال فقط ويغطي الزجاج والإطارات.\n• الحماية الفائقة: إعفاء كامل (0 ريال تحمل) وراحة بال تامة عند إحضار تقرير الحادث الرسمي (نجم/المرور).',
      en: '• Basic: Included free, covers third-party liability with standard deductible on collision.\n• Comprehensive: Reduces deductible to 500 SAR and covers windshield & tire wear.\n• Zero Liability: 0 SAR deductible with complete coverage upon submitting official Najm/Police traffic report.'
    }
  },
  {
    id: 'faq-4',
    category: 'traffic',
    question: {
      ar: 'كيف يتم التعامل مع المخالفات المرورية (ساهر) والرسوم؟',
      en: 'How are traffic fines (Saher) and road tolls handled?'
    },
    answer: {
      ar: 'يتم تسجيل عقد الإيجار وتوثيقه داخلياً لدى الشركة بالتزامن مع بيانات المستأجر وهوية المركبة. تسجل المخالفات المرورية على سجل المستأجر كما تصدر له ولا تضاف عليها أي رسوم إدارية.',
      en: 'Rental contracts are verified and recorded internally by the company against the renter details and vehicle identity. Traffic violations are settled by the renter as issued, without any hidden administrative surcharges.'
    }
  },
  {
    id: 'faq-5',
    category: 'booking',
    question: {
      ar: 'هل يمكن استلام السيارة في مدينة وتسليمها في مدينة أخرى؟',
      en: 'Can I pick up the vehicle in one city and drop it off in another?'
    },
    answer: {
      ar: 'نعم بكل تأكيد! تتيح مجموعة الرفقة خدمة التسليم بين المدن والمطارات (مثل استلام في الرياض والتسليم في جدة أو الدمام)، مع احتساب رسم تنقل رمزي يظهر بوضوح في ملخص الحجز.',
      en: 'Yes absolutely! Al-Rufqah offers flexible one-way intercity rentals (e.g. pick up in Riyadh and return in Jeddah or Dammam) with transparent nominal transit fees calculated instantly at checkout.'
    }
  },
  {
    id: 'faq-6',
    category: 'payments',
    question: {
      ar: 'ما هي خيارات وطرق الدفع المتاحة لدى مجموعة الرفقة؟',
      en: 'What payment methods are supported at Al-Rufqah Car Rental?'
    },
    answer: {
      ar: 'نقبل بطاقات مدى (Mada) وفيزا وماستركارد (Visa/MasterCard) عبر بوابة الدفع الآمنة (Stripe)، أو الدفع عند الاستلام في الفرع، بالإضافة لاستبدال نقاط الولاء (الفرسان وقطاف).',
      en: 'We accept Mada, Visa and MasterCard through our secure payment gateway (Stripe), or pay on arrival at the branch, plus reward redemption via AlFursan & Qitaf.'
    }
  }
];
