import { BlogPost } from '../types';

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'saudi-road-trip-guide-riyadh-to-alula',
    title: {
      ar: 'دليل رحلات الطرق: من قلب الرياض إلى سحر العلا التاريخية',
      en: 'Saudi Road Trip Guide: Journey from Riyadh to Historic AlUla'
    },
    excerpt: {
      ar: 'اكتشف أفضل المسارات البرية، محطات التوقف الحيوية، وأنسب فئات السيارات لرحلة استكشافية لا تُنسى عبر جبال وصحراء المملكة.',
      en: 'Discover optimal driving routes, essential rest stops, and ideal SUV vehicle classes for an unforgettable expedition across Saudi terrains.'
    },
    content: {
      ar: `تعتبر الرحلة البرية من الرياض إلى العلا واحدة من أروع المغامرات السياحية في المملكة العربية السعودية. يمتد المسار لمسافة تقارب 1,050 كيلومتر عبر طرق سريعة حديثة ومجهزة بأعلى معايير السلامة.

### أفضل فئات السيارات المقترحة لهذه الرحلة:
1. **فئة الدفع الرباعي (SUV & 4x4)**: مثل تويوتا لاندكروزر أو نيسان باترول، لضمان أعلى مستويات الراحة والأمان عند عبور الطرق الجبلية والتضاريس الرملية في العلا.
2. **فئة السيدان الفاخرة**: مثل لكزس ES300h للمسافرين الباحثين عن كفاءة استهلاك الوقود وعزل صوتي فائق خلال السفر الطويل.

### نصائح ذهبية قبل الانطلاق:
- تأكد من باقة الكيلومترات المفتوحة عبر خيارات الحجز في مجموعة الرفقة.
- تفقد ضغط الإطارات ومستوى مياه التبريد في شاشات الكشف الرقمي.
- حمل نسخة إلكترونية من تفويض "تم" المتاح مباشرة عبر حسابك في منصة الرفقة.`,
      en: `The overland journey from Riyadh to AlUla spans approximately 1,050 km over world-class dual carriageways and scenic desert passes.

### Recommended Vehicle Tiers:
1. **Full-size 4WD SUVs**: Toyota Land Cruiser or Nissan Patrol for effortless cruising and exploring rugged desert attractions.
2. **Executive Hybrid Sedans**: Lexus ES300h for exceptional fuel autonomy and serene cabin isolation.

### Essential Pre-Departure Checklist:
- Opt for Al-Rufqah's Unlimited Mileage package.
- Verify your contract reference in the customer portal.
- Keep emergency SOS 24/7 hotline 9200 78372 saved on speed dial.`
    },
    category: 'tourism',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: { ar: 'م. فهد السبيعي', en: 'Eng. Fahad Al-Subaie' },
      role: { ar: 'مستشار التنقل والرحلات', en: 'Mobility & Tourism Advisor' },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2025-02-15',
    readTimeMinutes: 5,
    likes: 184,
    views: 3420,
    isFeatured: true,
    isPublished: true,
    tags: ['رحلات_برية', 'العلا', 'نصائح_القيادة', 'تأجير_سيارات']
  },
  {
    id: 'post-2',
    slug: 'vision-2030-smart-mobility-and-evs',
    title: {
      ar: 'مستقبل التنقل الأخضر في المملكة: توسع أسطول السيارات الكهربائية والهجينة',
      en: 'Green Mobility in KSA: The Rapid Expansion of Electric & Hybrid Fleets'
    },
    excerpt: {
      ar: 'كيف تقود مجموعة الرفقة التحول نحو الطاقة النظيفة والتأجير المستدام بالتعاون مع محطات الشحن السريع في كافة المدن.',
      en: 'How Al-Rufqah Group is pioneering sustainable car rental alongside national EV supercharging networks.'
    },
    content: {
      ar: `في إطار مبادرة السعودية الخضراء ومستهدفات رؤية 2030، تشهد البنية التحتية للنقل الذكي طفرة هائلة في انتشار محطات الشحن فائق السرعة على الطرق السريعة وداخل المراكز التجارية والمطارات.

وتفخر مجموعة الرفقة بدمج أكثر من 1,500 سيارة كهربائية وهجينة حديثة (موديلات 2025) ضمن أسطولها المتاح للحجز الفوري مع توفير شواحن منزلية ومنافذ شحن معتمدة.`,
      en: `Under the Saudi Green Initiative and Vision 2030 roadmap, ultra-fast EV charging infrastructure is transforming daily commuting and intercity travel across the Kingdom.

Al-Rufqah Group proudly integrates over 1,500 state-of-the-art 2025 EV & Hybrid models into its instantly bookable fleet.`
    },
    category: 'vision2030',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: { ar: 'سارة الدوسري', en: 'Sarah Al-Dossary' },
      role: { ar: 'رئيسة الابتكار والاستدامة', en: 'Head of Innovation & ESG' },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2025-02-10',
    readTimeMinutes: 4,
    likes: 142,
    views: 2890,
    isFeatured: false,
    isPublished: true,
    tags: ['رؤية_2030', 'سيارات_كهربائية', 'استدامة', 'تقنية_السيارات']
  },
  {
    id: 'post-3',
    slug: 'car-maintenance-summer-driving-tips',
    title: {
      ar: 'نصائح حيوية لقيادة آمنة وكفاءة قصوى لتكييف السيارة خلال فصل الصيف',
      en: 'Summer Driving in KSA: A/C Efficiency & Critical Tyre Safety Tips'
    },
    excerpt: {
      ar: 'إرشادات ميكانيكية متخصصة للحفاظ على برودة المقصورة وسلامة الإطارات عند ارتفاع درجات الحرارة في الرحلات الطويلة.',
      en: 'Expert maintenance advice to ensure optimal cabin climate and tire integrity in high ambient desert temperatures.'
    },
    content: {
      ar: `تتطلب القيادة في الأجواء الحارة عناية خاصة بمعدلات ضغط الهواء في الإطارات مع الأخذ بالاعتبار تمدد الهواء بالحرارة.

تعتمد مجموعة الرفقة بروتوكول فحص دوري دقيق يشمل:
- فحص كفاءة غاز الفريون وتنظيف فلتر المكيف قبل كل تسليم.
- فحص عمق مداس الإطارات وتاريخ إنتاجها (أقل من عامين).
- تزويد جميع المركبات بعوازل حرارية زجاجية معتمدة وفق اشتراطات المرور.`,
      en: `High ambient temperatures demand strict attention to tire cold inflation pressure, engine coolant boiling points, and AC compressor performance.

Every Al-Rufqah vehicle undergoes rigorous multi-point inspection prior to customer handover.`
    },
    category: 'maintenance',
    coverImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: { ar: 'م. طارق الخالدي', en: 'Eng. Tariq Al-Khaldi' },
      role: { ar: 'مدير الصيانة الفنية للأسطول', en: 'Fleet Technical Director' },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2025-01-28',
    readTimeMinutes: 6,
    likes: 98,
    views: 1950,
    isFeatured: false,
    isPublished: true,
    tags: ['صيانة_السيارات', 'نصائح_الصيف', 'سلامة_المرور']
  },
  {
    id: 'post-4',
    slug: 'riyadh-season-events-car-rental-guide',
    title: {
      ar: 'دليل فعاليات ومواسم الرياض: كيف تختار السيارة الأنسب لتنقلاتك',
      en: 'Riyadh Season Mobility Guide: Choosing the Ideal Ride for Events'
    },
    excerpt: {
      ar: 'من بوليفارد وورلد إلى المربع والمملكة أرينا، إليك خطة تنقل ذكية لتفادي الازدحام مع خدمة الاستلام السريع من الفروع.',
      en: 'From Boulevard World to Kingdom Arena, streamline your event mobility with express pickup and VIP parking access.'
    },
    content: {
      ar: `تشهد العاصمة الرياض فعاليات عالمية متواصلة ضمن موسم الرياض والمؤتمرات الدولية. لتجربة تنقل سلسة، ننصح بما يلي:

1. **حجز السيارة مسبقاً من فروع مطار الملك خالد الدولي**: الاستلام السريع خلال دقائق بعد التحقق من الوثائق.
2. **اختيار باقة الحماية الشاملة سوبر**: لراحة بال مطلقة بدون تحمل أي مبالغ تأمين في حال حدوث خدوش غير متوقعة في المواقف المزدحمة.`,
      en: `With millions of visitors attending world-class Riyadh Season zones, smart transit planning is paramount.

Opt for express branch pickup and zero-excess comprehensive protection for stress-free parking.`
    },
    category: 'guides',
    coverImage: 'https://images.unsplash.com/photo-1512958789358-4dac4483a992?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: { ar: 'ريم العتيبي', en: 'Reem Al-Otaibi' },
      role: { ar: 'أخصائية تجربة العميل', en: 'Customer Experience Lead' },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2025-01-14',
    readTimeMinutes: 4,
    likes: 210,
    views: 4120,
    isFeatured: false,
    isPublished: true,
    tags: ['موسم_الرياض', 'سياحة_السعودية', 'حجز_المطار']
  }
];
