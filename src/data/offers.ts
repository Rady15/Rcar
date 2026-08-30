import { Offer } from '../types';

export const OFFERS_DATA: Offer[] = [
  {
    id: 'offer-weekend',
    title: { ar: 'عرض الويكند المميز - خصم 20%', en: 'Special Weekend Escape - 20% OFF' },
    description: {
      ar: 'استمتع بإجازة نهاية الأسبوع مع خصم فوري 20% على جميع سيارات السيدان والعائلية عند الحجز من الخميس إلى السبت.',
      en: 'Enjoy your weekend getaways with an instant 20% discount on all Sedans and SUVs from Thursday to Saturday.'
    },
    discount: '20% OFF',
    code: 'WEEKEND20',
    badge: { ar: 'عرض الأسبوع', en: 'Weekly Deal' },
    validUntil: '2026-12-31',
    category: 'weekend',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    applicableCategories: ['sedan', 'suv', 'family']
  },
  {
    id: 'offer-alfursan',
    title: { ar: 'نقاط الفرسان المضاعفة (5x أميال)', en: '5x AlFursan Reward Miles' },
    description: {
      ar: 'اكسب 5 أميال مكافأة مع الفرسان لكل 10 ريالات تنفقها في استئجار أي سيارة من مجموعة الرفقة عبر كافة فروع المطارات.',
      en: 'Earn 5 bonus AlFursan miles for every 10 SAR spent on your car rentals across all airport branches.'
    },
    discount: '5X MILES',
    code: '',
    badge: { ar: 'شريك الطيران', en: 'Airline Partner' },
    validUntil: '2026-11-30',
    category: 'partner',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'offer-monthly',
    title: { ar: 'باقة الاشتراك الشهري المخفضة - وفر حتى 35%', en: 'Monthly Subscription Plan - Save 35%' },
    description: {
      ar: 'استأجر شهرياً بأقل تكلفة مع تأمين شامل، صيانة مجانية دورية، كيلومترات مفتوحة، وتوصيل السيارة حتى باب منزلك أو عملك.',
      en: 'Rent monthly at unbeatable rates with full insurance, routine maintenance, open mileage, and doorstep delivery.'
    },
    discount: '35% OFF',
    code: 'MONTHLY35',
    badge: { ar: 'التأجير الشهري', en: 'Monthly Lease' },
    validUntil: '2026-12-31',
    category: 'monthly',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'offer-airport-fast',
    title: { ar: 'عرض المسافر السريع - خصم 15% بالمطارات', en: 'Express Airport Deal - 15% OFF' },
    description: {
      ar: 'استلم سيارتك ذاتياً وبدون انتظار في صالات مطار الملك خالد والملك عبدالعزيز والملك فهد مع خصم 15% بالدفع الإلكتروني المسبق.',
      en: 'Fast self-service keyless pickup at KKIA, KAIA, and KFIA with 15% off when paying online.'
    },
    discount: '15% OFF',
    code: 'AIRPORT15',
    badge: { ar: 'فروع المطار', en: 'Airport Express' },
    validUntil: '2026-10-31',
    category: 'airport',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'offer-qitaf',
    title: { ar: 'عرض قطاف stc - استبدل نقاطك برحلات مجانية', en: 'stc Qitaf Rewards - Redeem Points' },
    description: {
      ar: 'استبدل نقاط قطاف بقسائم خصم فورية أو اكسب نقاط قطاف عند كل عملية تأجير بجميع فروع مجموعة الرفقة في المملكة.',
      en: 'Redeem stc Qitaf points for instant rental vouchers or earn Qitaf points on every ride.'
    },
    discount: 'QITAF VIP',
    code: 'QITAF2025',
    badge: { ar: 'شريك الاتصالات', en: 'Telecom Partner' },
    validUntil: '2026-12-31',
    category: 'partner',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'offer-early-booking',
    title: { ar: 'الحجز المبكر - وفر 10% إضافية', en: 'Early Bird Booking - Extra 10% OFF' },
    description: {
      ar: 'احجز قبل موعد رحلتك بـ 5 أيام على الأقل واحصل على خصم 10% إضافي فوق أي عرض حالي.',
      en: 'Book at least 5 days in advance and get an additional 10% discount on top of active deals.'
    },
    discount: '10% OFF',
    code: 'EARLYBIRD',
    badge: { ar: 'حجز مسبق', en: 'Early Bird' },
    validUntil: '2026-12-31',
    category: 'daily',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  }
];
