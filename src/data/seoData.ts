import {
  GlobalSeoSettings,
  PageSeoConfig,
  SchemaConfig,
  RobotsConfig,
  KeywordRankItem
} from '../types/seo';

export const INITIAL_GLOBAL_SEO: GlobalSeoSettings = {
  siteName: {
    ar: 'مجموعة الرفاهة لتأجير السيارات الفاخرة والحديثة',
    en: 'Al-Rifaha Luxury Car Rental Saudi Arabia'
  },
  defaultTitle: {
    ar: 'تأجير سيارات فخمة واقتصادية في السعودية | فروع المطارات وحجز فوري',
    en: 'Luxury & Economy Car Rental in Saudi Arabia | Airport Branches'
  },
  titleSeparator: '|',
  metaDescription: {
    ar: 'أفضل شركة تأجير سيارات في الرياض، جدة، والدمام. أسطول من أحدث سيارات مرسيدس، بي إم دبليو، رينج روفر وسيارات اقتصادية مع توثيق عقود فوري، خدمة التوصيل، وتأمين شامل بدون دفعة أولى.',
    en: 'Top rated car rental in Riyadh, Jeddah, Dammam & KSA airports. Book Mercedes, BMW, Range Rover & economy cars with instant internal contract verification, roadside SOS & full insurance.'
  },
  canonicalBaseUrl: '',
  defaultKeywords: {
    ar: [
      'تأجير سيارات الرياض',
      'ايجار سيارات فخمة السعودية',
      'تأجير سيارات مطار الملك خالد',
      'تأجير سيارات مطار الملك عبدالعزيز',
      'تأجير مرسيدس الرياض',
      'تفويض تم فوري',
      'عروض تأجير سيارات شهرية',
      'تأجير سيارات بدون بطاقة ائتمانية',
      'ارخص تأجير سيارات بالرياض',
      'اشتراك سيارات شهري'
    ],
    en: [
      'car rental riyadh',
      'luxury car rental saudi arabia',
      'riyadh airport car hire',
      'jeddah car rental',
      'rent mercedes riyadh',
      'digital rental contract verification',
      'monthly car subscription ksa',
      'best car rental saudi'
    ]
  },
  ogImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&h=630&q=90',
  twitterCard: 'summary_large_image',
  twitterSite: '@AlRifahaRental',
  robotsIndexing: 'index, follow',
  googleSiteVerification: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  geoRegion: 'SA-01',
  geoPlacename: 'Riyadh, Kingdom of Saudi Arabia',
  geoPosition: '24.7136;46.6753',
  icbm: '24.7136, 46.6753'
};

export const INITIAL_PAGE_SEO_CONFIGS: PageSeoConfig[] = [
  {
    id: 'home',
    name: { ar: 'الصفحة الرئيسية', en: 'Homepage' },
    title: {
      ar: 'مجموعة الرفاهة لتأجير السيارات | حجز سيارات فخمة واقتصادية بالسعودية',
      en: 'Al-Rifaha Car Rental | Premium & Fleet Rentals in Saudi Arabia'
    },
    description: {
      ar: 'احجز سيارتك الآن مع الرفقة لتأجير السيارات. أفضل أسعار التأجير اليومي والشهري بالرياض وجدة وفروع المطارات. توثيق العقود الفوري وتأمين شامل.',
      en: 'Book your luxury or economy rental in Saudi Arabia. Best daily & monthly rates in Riyadh, Jeddah airports with instant contract verification.'
    },
    keywords: {
      ar: ['تأجير سيارات الرياض', 'تأجير سيارات المطار', 'حجز سيارة اونلاين', 'ايجار يومي وشهري'],
      en: ['car rental saudi', 'riyadh airport rental', 'luxury cars hire']
    },
    canonicalSlug: '/',
    priority: 1.0,
    changeFreq: 'daily',
    schemaType: 'AutoRental',
    isIndexed: true
  },
  {
    id: 'fleet',
    name: { ar: 'أسطول السيارات', en: 'Fleet Catalog' },
    title: {
      ar: 'أسطول سيارات للإيجار | سيارات فارهة، سيدان، دفع رباعي SUV بالسعودية',
      en: 'Fleet of Luxury, SUV & Economy Rental Cars | Al-Rifaha'
    },
    description: {
      ar: 'استكشف أسطول سيارات الرفاهة: مرسيدس S-Class، مايباخ، رينج روفر، لاند كروزر، توسان وكامري بأفضل الأسعار مع عداد كيلومترات مجاني.',
      en: 'Explore our vehicle fleet: Mercedes S-Class, Maybach, Range Rover, Land Cruiser, Camry & more. Guaranteed availability & transparent pricing.'
    },
    keywords: {
      ar: ['اسطول سيارات', 'ايجار مرسيدس اس كلاس', 'تاجير جيب رينج روفر', 'ايجار سيارات عائلية'],
      en: ['fleet car rental', 'rent mercedes s class', 'suv rental riyadh']
    },
    canonicalSlug: '/fleet',
    priority: 0.9,
    changeFreq: 'daily',
    schemaType: 'Product',
    isIndexed: true
  },
  {
    id: 'branches',
    name: { ar: 'الفروع والمطارات', en: 'Branches & Airports' },
    title: {
      ar: 'فروع تأجير السيارات في مطارات ومدن السعودية | فروع المطارات والمدن',
      en: 'Car Rental Branches across Saudi Airports & Major Cities | Al-Rifaha'
    },
    description: {
      ar: 'فروعنا في مطار الملك خالد بالرياض، مطار الملك عبدالعزيز بجدة، ومطار الملك فهد بالدمام. خدمة 24 ساعة وصالات انتظار مريحة.',
      en: 'Find our branches at King Khalid Airport Riyadh, King Abdulaziz Airport Jeddah, King Fahd Dammam. 24/7 service with comfortable lounges.'
    },
    keywords: {
      ar: ['تأجير سيارات مطار الرياض', 'تأجير سيارات مطار جدة صالة 1', 'فروع تأجير سيارات 24 ساعة'],
      en: ['riyadh airport rental terminal 5', 'jeddah airport car rental']
    },
    canonicalSlug: '/branches',
    priority: 0.9,
    changeFreq: 'weekly',
    schemaType: 'LocalBusiness',
    isIndexed: true
  },
  {
    id: 'offers',
    name: { ar: 'العروض والتخفيضات', en: 'Promotions & Offers' },
    title: {
      ar: 'عروض وكوبونات خصم تأجير السيارات | خصومات تصل 30% مع الرفاهة',
      en: 'Exclusive Car Rental Offers & Promo Codes | Al-Rifaha'
    },
    description: {
      ar: 'أقوى عروض تأجير السيارات في السعودية. خصومات نهاية الأسبوع، عروض اليوم الوطني، وكوبونات حصرية لعملاء الحجز المبكر والتأجير الشهري.',
      en: 'Discover special weekend deals, monthly discounts and promo codes for luxury and economy rentals across Saudi Arabia.'
    },
    keywords: {
      ar: ['عروض تأجير السيارات', 'كوبون خصم تأجير سيارات', 'كود خصم الرفاهة', 'تخفيضات اليوم الوطني'],
      en: ['car rental discounts', 'promo codes car rental saudi']
    },
    canonicalSlug: '/offers',
    priority: 0.8,
    changeFreq: 'daily',
    schemaType: 'Product',
    isIndexed: true
  },
  {
    id: 'corporate',
    name: { ar: 'خدمات الشركات B2B', en: 'Corporate Fleet' },
    title: {
      ar: 'حلول تأجير السيارات للشركات والمؤسسات | عقود طويلة الأجل وأسطول مخصص',
      en: 'Corporate Fleet Leasing & Business Rentals in Saudi Arabia'
    },
    description: {
      ar: 'حلول ذكية لأسطول الشركات في السعودية. عقود تشغيلية طويلة الأجل، صيانة مجانية شاملة، سيارات بديلة فورية وفواتير إيجار معتمدة.',
      en: 'Tailored B2B corporate leasing solutions, operational fleet management, dedicated account managers & verified rental invoicing.'
    },
    keywords: {
      ar: ['تأجير سيارات للشركات', 'عقود تأجير سيارات طويلة الأجل', 'أسطول شركات الرياض', 'تاجير تشغيلي'],
      en: ['corporate car leasing', 'b2b fleet rental riyadh']
    },
    canonicalSlug: '/corporate',
    priority: 0.8,
    changeFreq: 'weekly',
    schemaType: 'LocalBusiness',
    isIndexed: true
  },
  {
    id: 'subscription',
    name: { ar: 'الاشتراكات الشهرية', en: 'Monthly Subscription' },
    title: {
      ar: 'اشتراك السيارات الشهري في السعودية | بديل شراء السيارات بدون التزامات',
      en: 'Monthly Car Subscription in KSA | Drive Without Ownership Hassles'
    },
    description: {
      ar: 'اشترك شهرياً في سيارتك المفضلة بدون دفعة أولى أو التزامات بنكية. يشمل التأمين الشامل، الصيانة الدورية وإمكانية تغيير السيارة كل شهر.',
      en: 'Flexible monthly all-inclusive car subscriptions. Insurance, maintenance & roadside assistance included with easy swap options.'
    },
    keywords: {
      ar: ['اشتراك سيارة شهري', 'تاجير شهري بدون دفعة اولى', 'بديل شراء سيارة'],
      en: ['monthly car subscription', 'car lease by month saudi']
    },
    canonicalSlug: '/subscription',
    priority: 0.8,
    changeFreq: 'weekly',
    schemaType: 'Product',
    isIndexed: true
  },
  {
    id: 'used-cars',
    name: { ar: 'السيارات المعتمدة للبيع', en: 'Certified Pre-Owned' },
    title: {
      ar: 'سيارات مستعملة مضمونة ومفحوصة للبيع | أسطول الرفاهة المعتمد بالضمان',
      en: 'Certified Pre-Owned Luxury Cars for Sale with Warranty | Al-Rifaha'
    },
    description: {
      ar: 'شراء سيارات مستعملة معتمدة مفحوصة بـ 150 نقطة فحص فني مع ضمان ساري وتقارير صيانة دورية كاملة وإمكانية التقسيط الميسر.',
      en: 'Buy inspected pre-owned certified vehicles with warranty, full maintenance records and easy installment financing.'
    },
    keywords: {
      ar: ['سيارات مستعملة مضمونة', 'شراء سيارات اسطول التاجير', 'سيارات فحص شامل الرياض'],
      en: ['used cars certified riyadh', 'pre owned luxury cars ksa']
    },
    canonicalSlug: '/used-cars',
    priority: 0.7,
    changeFreq: 'weekly',
    schemaType: 'Product',
    isIndexed: true
  },
  {
    id: 'loyalty',
    name: { ar: 'برنامج الولاء والمكافآت', en: 'Loyalty Rewards' },
    title: {
      ar: 'برنامج مكافآت الرفاهة | ترقيات مجانية وأيام تأجير هدية ونقاط مضاعفة',
      en: 'Al-Rifaha Rewards & Loyalty Club | VIP Upgrades & Free Rental Days'
    },
    description: {
      ar: 'انضم لبرنامج مكافآت الرفاهة واحصل على نقاط مع كل ريال تنفقه. استبدل النقاط بأيام مجانية، ترقية مجانية لفئة أعلى وخدمة استلام VIP بالمطار.',
      en: 'Earn points on every rental. Redeem points for free rental days, complimentary vehicle upgrades and priority VIP airport service.'
    },
    keywords: {
      ar: ['برنامج ولاء تأجير سيارات', 'نقاط مكافآت الرفاهة', 'ترقية مجانية للسيارة'],
      en: ['car rental loyalty rewards', 'vip rental upgrades ksa']
    },
    canonicalSlug: '/loyalty',
    priority: 0.7,
    changeFreq: 'monthly',
    schemaType: 'LocalBusiness',
    isIndexed: true
  },
  {
    id: 'blog',
    name: { ar: 'المدونة ودليل الطرق', en: 'Blog & Travel Guides' },
    title: {
      ar: 'دليل القيادة والسياحة بالسيارة في السعودية | نصائح الطرق وأحدث تقنيات السيارات',
      en: 'Saudi Driving & Road Trip Guides | Automotive News & Tips'
    },
    description: {
      ar: 'مقالات وأدلة سياحية شاملة للقيادة في المملكة: أفضل مسارات الرحلات البرية بالعلا وأبها، لوائح المرور وساهر، ومقارنات أحدث سيارات.',
      en: 'Comprehensive Saudi road trip guides, scenic highway routes, driving regulations, traffic safety tips and automotive reviews.'
    },
    keywords: {
      ar: ['دليل القيادة في السعودية', 'رحلات برية العلا وابها', 'لوائح المرور وساهر', 'نصائح استئجار سيارة'],
      en: ['saudi road trip guides', 'driving in saudi arabia tips']
    },
    canonicalSlug: '/blog',
    priority: 0.8,
    changeFreq: 'weekly',
    schemaType: 'Article',
    isIndexed: true
  },
  {
    id: 'faq',
    name: { ar: 'الأسئلة الشائعة', en: 'FAQ & Help' },
    title: {
      ar: 'الأسئلة الشائعة حول تأجير السيارات بالسعودية | شروط التأجير وتفويض تم والتأمين',
      en: 'Frequently Asked Questions about Car Rental in Saudi Arabia'
    },
    description: {
      ar: 'إجابات شاملة عن كافة استفسارات تأجير السيارات: شروط استئجار سيارة للمواطن والمقيم والزائر، توثيق عقود الإيجار، التأمين والودائع وطرق الدفع.',
      en: 'Clear answers on rental requirements, rental contract verification, zero-deductible insurance policies, driver license validity and payments.'
    },
    keywords: {
      ar: ['شروط تأجير السيارات بالسعودية', 'توثيق عقود الإيجار للمقيمين', 'تامين السيارات المستأجرة'],
      en: ['car rental requirements ksa', 'rental contract permit questions']
    },
    canonicalSlug: '/faq',
    priority: 0.8,
    changeFreq: 'monthly',
    schemaType: 'FAQPage',
    isIndexed: true
  },
  {
    id: 'contact',
    name: { ar: 'اتصل بنا والدعم', en: 'Contact & Support' },
    title: {
      ar: 'تواصل مع مجموعة الرفاهة | خدمة العملاء 24/7 وطوارئ الطريق SOS',
      en: 'Contact Al-Rifaha Car Rental | 24/7 Customer Support & Roadside SOS'
    },
    description: {
      ar: 'مركز الاتصال الموحد وخدمة المساعدة على الطريق 24/7. تواصل معنا عبر الواتساب، الهاتف المجاني، أو تفضل بزيارة أقرب فرع في مدينتك.',
      en: '24/7 unified support center & roadside assistance. Reach our support team via WhatsApp, toll-free number or visit our nearest branch.'
    },
    keywords: {
      ar: ['رقم شركة الرفاهة لتأجير السيارات', 'طوارئ الطريق تأجير سيارات', 'خدمة عملاء تاجير سيارات'],
      en: ['car rental customer service riyadh', 'roadside support ksa']
    },
    canonicalSlug: '/contact',
    priority: 0.7,
    changeFreq: 'monthly',
    schemaType: 'LocalBusiness',
    isIndexed: true
  }
];

export const INITIAL_SCHEMA_CONFIG: SchemaConfig = {
  enableAutoRentalSchema: true,
  enableFaqSchema: true,
  enableBreadcrumbSchema: true,
  enableCarProductsSchema: true,
  companyLegalName: {
    ar: 'شركة مجموعة الرفاهة لتأجير السيارات المحدودة',
    en: 'Al-Rifaha Car Rental Company Ltd.'
  },
  telephone: '+9668001248899',
  email: '',
  priceRange: '$$$ (120 SAR - 2,500 SAR)',
  currenciesAccepted: 'SAR',
  paymentAccepted: 'Cash, Credit Card, Mada (Stripe)',
  ratingValue: 4.9,
  reviewCount: 4850,
  streetAddress: {
    ar: 'طريق الملك فهد، حي الصحافة',
    en: 'King Fahd Road, Al Sahafah District'
  },
  addressLocality: {
    ar: 'الرياض',
    en: 'Riyadh'
  },
  postalCode: '13315',
  addressCountry: 'SA'
};

export const INITIAL_ROBOTS_CONFIG: RobotsConfig = {
  customRobotsTxt: `# robots.txt for Al-Rifaha Car Rental KSA
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /manage-booking/

# Googlebot specific directives
User-agent: Googlebot
Allow: /
Allow: /fleet/
Allow: /branches/
Allow: /offers/
Allow: /blog/
Crawl-delay: 1

# Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 2

Sitemap: /sitemap.xml
`,
  disallowAdmin: true,
  disallowApi: true,
  crawlDelay: 1,
  sitemapUrl: '/sitemap.xml'
};

export const INITIAL_KEYWORD_RANKINGS: KeywordRankItem[] = [
  {
    id: 'kw-1',
    keyword: 'تأجير سيارات الرياض',
    city: 'الرياض',
    monthlyVolume: 74000,
    currentRank: 1,
    previousRank: 2,
    serpFeatures: ['rich_snippet', 'maps_pack', 'sitelinks', 'star_ratings'],
    difficulty: 'hard',
    targetUrl: '/'
  },
  {
    id: 'kw-2',
    keyword: 'تأجير سيارات فخمة الرياض',
    city: 'الرياض',
    monthlyVolume: 28500,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ['rich_snippet', 'star_ratings', 'images_pack'],
    difficulty: 'medium',
    targetUrl: '/fleet'
  },
  {
    id: 'kw-3',
    keyword: 'تأجير سيارات مطار الملك خالد',
    city: 'الرياض (المطار)',
    monthlyVolume: 49000,
    currentRank: 2,
    previousRank: 3,
    serpFeatures: ['maps_pack', 'rich_snippet', 'sitelinks'],
    difficulty: 'hard',
    targetUrl: '/branches'
  },
  {
    id: 'kw-4',
    keyword: 'ايجار مرسيدس بالسعودية',
    city: 'كافة المدن',
    monthlyVolume: 19800,
    currentRank: 1,
    previousRank: 2,
    serpFeatures: ['rich_snippet', 'images_pack'],
    difficulty: 'medium',
    targetUrl: '/fleet'
  },
  {
    id: 'kw-5',
    keyword: 'تأجير سيارات مطار جدة صالة 1',
    city: 'جدة',
    monthlyVolume: 33000,
    currentRank: 2,
    previousRank: 2,
    serpFeatures: ['maps_pack', 'rich_snippet'],
    difficulty: 'hard',
    targetUrl: '/branches'
  },
  {
    id: 'kw-6',
    keyword: 'تفويض تم فوري تأجير سيارات',
    city: 'السعودية',
    monthlyVolume: 14500,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ['rich_snippet', 'faq_dropdown'],
    difficulty: 'easy',
    targetUrl: '/faq'
  },
  {
    id: 'kw-7',
    keyword: 'اشتراك سيارة شهري الرياض',
    city: 'الرياض',
    monthlyVolume: 12200,
    currentRank: 3,
    previousRank: 4,
    serpFeatures: ['rich_snippet', 'sitelinks'],
    difficulty: 'medium',
    targetUrl: '/subscription'
  },
  {
    id: 'kw-8',
    keyword: 'عروض تأجير سيارات اليوم الوطني',
    city: 'السعودية',
    monthlyVolume: 56000,
    currentRank: 1,
    previousRank: 1,
    serpFeatures: ['rich_snippet', 'star_ratings'],
    difficulty: 'hard',
    targetUrl: '/offers'
  }
];
