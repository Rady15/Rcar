// Bilingual strings (ar / en) for the customer-facing site.

export type Lang = "ar" | "en";

export const t = {
  // Nav
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_browse: { ar: "تصفّح السيارات", en: "Browse Cars" },
  nav_deals: { ar: "العروض", en: "Deals" },
  nav_categories: { ar: "الفئات", en: "Categories" },
  nav_favorites: { ar: "المفضلة", en: "Favorites" },
  nav_signin: { ar: "تسجيل الدخول", en: "Sign In" },
  nav_signin_full: { ar: "تسجيل الدخول | إنشاء حساب", en: "Sign In | Create Account" },
  nav_hi: { ar: "مرحباً،", en: "Hi," },
  nav_menu: { ar: "القائمة", en: "Menu" },
  nav_account: { ar: "حسابي", en: "My Account" },
  nav_back: { ar: "العودة للموقع", en: "Back to site" },
  nav_signout: { ar: "تسجيل الخروج", en: "Sign out" },

  // Hero
  hero_badge: { ar: "أكثر من 18 سيارة متاحة الآن", en: "18+ cars available now" },
  hero_title: { ar: "تجربة قيادة تُؤهِّلك", en: "A driving experience that qualifies you" },
  hero_subtitle: {
    ar: "استأجر سيارة فاخرة في دقائق — مع التوصيل لباب منزلك",
    en: "Rent a luxury car in minutes — delivered to your doorstep",
  },
  hero_search_hint: { ar: "اسحب للأسفل للاستكشاف", en: "Scroll to explore" },

  // Tabs
  tab_search: { ar: "ابحث الآن", en: "Search Now" },
  tab_consultations: { ar: "الاستشارات السيارة", en: "Car Consultations" },
  tab_rental: { ar: "إيجار الحجز", en: "Rental Booking" },
  tab_longterm: { ar: "تأجير طويل الأجل", en: "Long-term Rental" },
  tab_paycollect: { ar: "باي واستلم", en: "Pay & Collect" },

  // Search form
  field_location: { ar: "موقع الاستلام و التسليم", en: "Pickup & Drop-off Location" },
  field_location_placeholder: { ar: "حدد المدينة", en: "Select city" },
  field_pickup_date: { ar: "تاريخ و وقت الاستلام", en: "Pickup Date & Time" },
  field_return_date: { ar: "تاريخ و وقت التسليم", en: "Drop-off Date & Time" },
  field_pickup_location: { ar: "موقع الاستلام", en: "Pickup Location" },
  field_dropoff_location: { ar: "موقع التسليم", en: "Drop-off Location" },
  field_pickup_date_short: { ar: "تاريخ الاستلام", en: "Pickup Date" },
  field_dropoff_date_short: { ar: "تاريخ التسليم", en: "Drop-off Date" },
  field_car_type: { ar: "نوع السيارة", en: "Car Type" },
  field_duration: { ar: "مدة الاشتراك", en: "Subscription Duration" },
  field_city: { ar: "المدينة", en: "City" },
  field_name: { ar: "الاسم الكامل", en: "Full Name" },
  field_phone: { ar: "رقم الجوال", en: "Phone Number" },
  field_booking_code: { ar: "رقم الحجز", en: "Booking Code" },
  field_showroom: { ar: "معرض الاستلام", en: "Collection Showroom" },
  field_name_placeholder: { ar: "اكتب اسمك", en: "Enter your name" },
  field_phone_placeholder: { ar: "05xxxxxxxx", en: "05xxxxxxxx" },

  // Buttons
  btn_search: { ar: "ابحث", en: "Search" },
  btn_book: { ar: "احجز", en: "Book" },
  btn_subscribe: { ar: "اشترك", en: "Subscribe" },
  btn_pay_collect: { ar: "ادفع واستلم", en: "Pay & Collect" },
  btn_request_consultation: { ar: "اطلب استشارة", en: "Request Consultation" },
  btn_browse: { ar: "تصفّح السيارات", en: "Browse cars" },
  btn_view_deals: { ar: "عرض العروض", en: "View deals" },
  btn_book_now: { ar: "احجز الآن", en: "Book now" },

  // Checkbox
  cb_same_location: { ar: "العودة لنفس الموقع", en: "Return to same location" },
  cb_same_pickup: { ar: "استلام من نفس الموقع", en: "Pickup from same location" },
  cb_same_dropoff: { ar: "استلام من نفس موقع التسليم", en: "Pickup from same drop-off location" },

  // Consultations
  cons_title: { ar: "استشارات سيارات مجانية", en: "Free car consultations" },
  cons_desc: {
    ar: "فريقنا جاهز لمساعدتك في اختيار السيارة المناسبة لاحتياجاتك",
    en: "Our team is ready to help you choose the right car for your needs",
  },
  cons_phone: { ar: "استشارة هاتفية", en: "Phone consultation" },
  cons_phone_desc: { ar: "خلال 30 دقيقة", en: "Within 30 minutes" },
  cons_inspect: { ar: "معاينة السيارة", en: "Car inspection" },
  cons_inspect_desc: { ar: "في معرضنا", en: "At our showroom" },
  cons_report: { ar: "تقرير مفصّل", en: "Detailed report" },
  cons_report_desc: { ar: "مقارنة شاملة", en: "Full comparison" },

  // Long-term
  lt_title: { ar: "تأجير طويل الأجل", en: "Long-term rental" },
  lt_desc: {
    ar: "وفّر أكثر مع اشتراك شهري — يشمل الصيانة والتأمين",
    en: "Save more with a monthly subscription — includes maintenance & insurance",
  },
  lt_month_1: { ar: "شهر واحد", en: "1 month" },
  lt_month_3: { ar: "3 أشهر (وفّر 10%)", en: "3 months (save 10%)" },
  lt_month_6: { ar: "6 أشهر (وفّر 20%)", en: "6 months (save 20%)" },
  lt_month_12: { ar: "سنة كاملة (وفّر 30%)", en: "12 months (save 30%)" },
  lt_maintenance: { ar: "صيانة دورية", en: "Regular maintenance" },
  lt_maintenance_desc: { ar: "مجانية", en: "Free" },
  lt_insurance: { ar: "تأمين شامل", en: "Comprehensive insurance" },
  lt_insurance_desc: { ar: "مشمول", en: "Included" },
  lt_replace: { ar: "استبدال", en: "Replacement" },
  lt_replace_desc: { ar: "كل 6 أشهر", en: "Every 6 months" },
  lt_type_sedan: { ar: "سيدان", en: "Sedan" },
  lt_type_suv: { ar: "دفع رباعي", en: "SUV" },
  lt_type_luxury: { ar: "فاخرة", en: "Luxury" },
  lt_type_electric: { ar: "كهربائية", en: "Electric" },

  // Pay & collect
  pc_title: { ar: "باي واستلم", en: "Pay & Collect" },
  pc_desc: {
    ar: "ادفع أونلاين واستلم سيارتك من أقرب معرض — بدون انتظار",
    en: "Pay online and collect your car from the nearest showroom — no waiting",
  },

  // Browse
  browse_title: { ar: "تصفّح السيارات", en: "Browse cars" },
  browse_count: { ar: "سيارة متاحة", en: "cars available" },
  browse_search_placeholder: { ar: "ابحث بالماركة، الموديل، اللون...", en: "Search by brand, model, color..." },
  browse_filters: { ar: "الفلاتر", en: "Filters" },
  browse_category: { ar: "الفئة", en: "Category" },
  browse_max_price: { ar: "أقصى سعر يومي", en: "Max price per day" },
  browse_sort: { ar: "ترتيب حسب", en: "Sort by" },
  browse_sort_recommended: { ar: "موصى به", en: "Recommended" },
  browse_sort_price_low: { ar: "السعر: من الأقل للأعلى", en: "Price: Low to High" },
  browse_sort_price_high: { ar: "السعر: من الأعلى للأقل", en: "Price: High to Low" },
  browse_sort_rating: { ar: "الأعلى تقييماً", en: "Top Rated" },
  browse_no_results: { ar: "لا توجد سيارات", en: "No cars found" },
  browse_no_results_desc: { ar: "جرّب تعديل الفلاتر أو كلمات البحث.", en: "Try adjusting filters or search terms." },
  browse_reset: { ar: "إعادة تعيين الفلاتر", en: "Reset filters" },
  browse_per_day: { ar: "/يوم", en: "/day" },
  browse_seats: { ar: "مقاعد", en: "seats" },

  // Footer
  footer_tagline: {
    ar: "تأجير سيارات فاخرة عند الطلب. من السيارات الهجينة الاقتصادية إلى السيارات الفاخرة، اعثر على سيارتك المثالية.",
    en: "Premium car rentals, on demand. From economy hybrids to supercars, find your perfect ride.",
  },
  footer_explore: { ar: "استكشف", en: "Explore" },
  footer_support: { ar: "الدعم", en: "Support" },
  footer_contact: { ar: "تواصل معنا", en: "Contact" },
  footer_categories: { ar: "الفئات", en: "Categories" },
  footer_featured: { ar: "سيارات مميزة", en: "Featured cars" },
  footer_deals: { ar: "العروض", en: "Deals" },
  footer_all_cars: { ar: "كل السيارات", en: "All cars" },
  footer_my_trips: { ar: "رحلاتي", en: "My Trips" },
  footer_favorites: { ar: "المفضلة", en: "Favorites" },
  footer_my_account: { ar: "حسابي", en: "My Account" },

  // Stats
  stat_premium_cars: { ar: "سيارات فاخرة", en: "Premium cars" },
  stat_trips: { ar: "رحلة مكتملة", en: "Trips completed" },
  stat_rating: { ar: "متوسط التقييم", en: "Average rating" },
  stat_support: { ar: "دعم على الطريق", en: "Roadside help" },

  // Sections
  section_find_fit: { ar: "اعثر على ما يناسبك", en: "Find your fit" },
  section_categories_title: { ar: "سيارة لكل مناسبة", en: "A car for every occasion" },
  section_categories_desc: {
    ar: "من السيارات الهجينة الموفرة للوقود إلى سيارات V8 — اضغط على فئة للانتقال مباشرةً للتصفّح.",
    en: "From fuel-sipping hybrids to roaring V8s — tap a category to jump straight into browsing.",
  },
  section_featured_title: { ar: "سيارات مميزة", en: "Featured cars" },
  section_featured_desc: { ar: "مختارة بعناية، منظفة حديثاً، جاهزة للقيادة.", en: "Hand-selected, freshly detailed, ready to drive." },
  section_featured_badge: { ar: "اختيارات المحرر", en: "Editor's picks" },
  section_popular_title: { ar: "الأكثر شعبية الآن", en: "Popular right now" },
  section_popular_desc: { ar: "السيارات اللي ما يقدرش النيويوركيين يبطلوا حجزها.", en: "The cars New Yorkers can't stop booking." },
  section_popular_badge: { ar: "رائج الآن", en: "Trending now" },
  section_budget_title: { ar: "عروض اقتصادية أقل من $100/يوم", en: "Budget picks under $100/day" },
  section_budget_desc: { ar: "قيمة كبيرة، سعر صغير. مثالية للتنقل اليومي ورحلات نهاية الأسبوع.", en: "Big value, small price tag. Perfect for daily commutes and weekend getaways." },
  section_budget_badge: { ar: "خيارات ذكية", en: "Smart choices" },
  section_deals_title: { ar: "عروض هذا الأسبوع", en: "Hot deals this week" },
  section_deals_desc: { ar: "وفّر حتى 40% على سيارات مختارة. عروض جديدة كل اثنين.", en: "Save up to 40% on selected cars. New promos drop every Monday." },
  section_deals_badge: { ar: "لفترة محدودة", en: "Limited time" },
  section_how_title_1: { ar: "محجوز في أقل من", en: "Booked in under" },
  section_how_title_2: { ar: "60 ثانية", en: "60 seconds" },
  section_how_desc: { ar: "لا طوابير، لا أوراق عند الكاونتر. كل الخطوات في جيبك.", en: "No queues, no paperwork at the counter. The whole flow lives in your pocket." },
  section_testimonials_title_1: { ar: "محبوب من", en: "Loved by" },
  section_testimonials_title_2: { ar: "آلاف", en: "thousands" },
  section_testimonials_desc: {
    ar: "حرّكنا أكثر من 6,400 مستأجر في نيويورك. ده اللي قالوه بعضهم.",
    en: "We've moved 6,400+ renters across NYC. Here's what a few of them had to say.",
  },
  section_cta_title: { ar: "جاهز للانطلاق؟", en: "Ready to hit the road?" },
  section_cta_desc: {
    ar: "انضم لآلاف المستأجرين السعداء. سجّل في 30 ثانية واحجز أول سيارة اليوم.",
    en: "Join thousands of happy renters. Sign up in 30 seconds and book your first car today.",
  },
  section_cta_primary: { ar: "ابدأ الآن", en: "Get started" },
  section_cta_secondary: { ar: "تصفّح السيارات", en: "Browse cars" },

  // Categories
  cat_all: { ar: "الكل", en: "All" },
  cat_sedan: { ar: "سيدان", en: "Sedan" },
  cat_suv: { ar: "دفع رباعي", en: "SUV" },
  cat_sports: { ar: "رياضية", en: "Sports" },
  cat_luxury: { ar: "فاخرة", en: "Luxury" },
  cat_electric: { ar: "كهربائية", en: "Electric" },
  cat_convertible: { ar: "كشف", en: "Convertible" },
  cat_van: { ar: "فان", en: "Van" },
} as const;

export type StringKey = keyof typeof t;

export function tr(key: StringKey, lang: Lang): string {
  return t[key][lang];
}
