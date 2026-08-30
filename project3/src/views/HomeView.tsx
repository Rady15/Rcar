import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingSearchWidget } from '../components/BookingSearchWidget';
import { CarCard } from '../components/CarCard';
import { SectionReveal } from '../components/SectionReveal';
import { HeroBgSlider } from '../components/HeroBgSlider';
import { CarCategory } from '../types';
import appStoreImg from '../assets/app store.png';
import googlePlayImg from '../assets/google play.png';
import fursanImg from '../assets/fursan.png';
import qitafImg from '../assets/qitaf.png';
import neqatyImg from '../assets/neqaty.png';
import najmImg from '../assets/najm.png';
import mobileImg from '../assets/mobile.jpeg';
import bannerBg from '../assets/banner-bg.jpg';
import {
  Car,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  Tag,
  Key,
  Building,
  Plane,
  HelpCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { language, t, navigateTo, applyPromoCode, cars, offers, faqs } = useApp();
  const [selectedHomeCat, setSelectedHomeCat] = useState<CarCategory>('all');

  const filteredCars = cars.filter((c) => {
    if (selectedHomeCat === 'all') return true;
    return c.category === selectedHomeCat;
  });

  const PARTNER_LOGOS = [
    { id: 'fursan', img: fursanImg, ar: 'الفرسان AlFursan', en: 'AlFursan Miles' },
    { id: 'qitaf', img: qitafImg, ar: 'قطاف stc Qitaf', en: 'Qitaf Rewards' },
    { id: 'neqaty', img: neqatyImg, ar: 'نقاطي Mobily', en: 'Neqaty Points' },
    { id: 'najm', img: najmImg, ar: 'نجم Najm', en: 'Najm Certified' },
  ];

  const categories: { id: CarCategory; label: string }[] = [
    { id: 'all', label: t.catAll },
    { id: 'economy', label: t.catEconomy },
    { id: 'sedan', label: t.catSedan },
    { id: 'suv', label: t.catSuv },
    { id: 'luxury', label: t.catLuxury },
    { id: 'family', label: t.catFamily },
    { id: 'commercial', label: t.catCommercial }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION WITH BACKGROUND AND SEARCH WIDGET */}
      <SectionReveal>
      <section className="relative bg-[#141210] text-white pt-10 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Background Image Slider (fade in/out) */}
        <HeroBgSlider />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9922C]/15 text-[#DFAB44] border border-[#C9922C]/30 text-xs font-black animate-pulse-subtle">
              <span>{language === 'ar' ? 'أفضل عروض تأجير السيارات 2025' : 'Best Car Rental Rates in KSA 2025'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Booking Search Box Container */}
          <div className="max-w-5xl mx-auto">
            <BookingSearchWidget onSearchSubmit={() => navigateTo('fleet')} />
          </div>
        </div>
      </section>
      </SectionReveal>

      {/* 2. TRUST STATS STRIP */}
      <SectionReveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#EDE4D3] flex items-center gap-4 hover:border-[#C9922C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black shrink-0 border border-[#ECD9BA]">
              <Building className="w-6 h-6 text-[#A47018]" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">50+</div>
              <div className="text-xs text-stone-500 font-semibold">{t.feature1Title}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#EDE4D3] flex items-center gap-4 hover:border-[#C9922C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black shrink-0 border border-[#ECD9BA]">
              <Plane className="w-6 h-6 text-[#A47018]" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">100%</div>
              <div className="text-xs text-stone-500 font-semibold">
                {language === 'ar' ? 'تغطية كافة مطارات المملكة' : 'All KSA Airport Terminals'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#EDE4D3] flex items-center gap-4 hover:border-[#C9922C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black shrink-0 border border-[#ECD9BA]">
              <Car className="w-6 h-6 text-[#A47018]" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">25,000+</div>
              <div className="text-xs text-stone-500 font-semibold">
                {language === 'ar' ? 'سيارة حديثة 2025' : 'Modern 2025 Vehicles'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#EDE4D3] flex items-center gap-4 hover:border-[#C9922C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black shrink-0 border border-[#ECD9BA]">
              <Clock className="w-6 h-6 text-[#A47018]" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">24/7</div>
              <div className="text-xs text-stone-500 font-semibold">{t.feature3Title}</div>
            </div>
          </div>
        </div>
      </section>
      </SectionReveal>

      {/* 3. FEATURED FLEET WITH QUICK CATEGORY FILTER */}
      <SectionReveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-[#A47018] uppercase tracking-wider block mb-1">
              {language === 'ar' ? 'أسطول الرفقة المتنوع' : 'Our Diverse Fleet'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              {language === 'ar' ? 'اختر السيارة المثالية لرحلتك' : 'Choose The Perfect Car For Your Journey'}
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedHomeCat(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedHomeCat === cat.id
                    ? 'gold-gradient-bg text-[#1C1917] font-black shadow-md shadow-[#C9922C]/25 border border-[#E9C682]'
                    : 'bg-white text-stone-700 hover:bg-[#FAF3E8] border border-[#EFE8DC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.slice(0, 6).map((car) => (
            <SectionReveal>
            <CarCard key={car.id} car={car} />
            </SectionReveal>
          ))}
        </div>

        {/* View all fleet CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('fleet')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-hover btn-pop bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 border border-[#3E3832]"
          >
            <span>{language === 'ar' ? 'استعراض كامل أسطول السيارات (18+ موديل)' : 'Browse Complete Fleet (18+ Models)'}</span>
            {language === 'ar' ? <ArrowLeft className="w-4 h-4 text-[#DFAB44]" /> : <ArrowRight className="w-4 h-4 text-[#DFAB44]" />}
          </button>
        </div>
      </section>
      </SectionReveal>



      {/* 5. EXCLUSIVE OFFERS & PROMOTIONS SLIDER/GRID */}
      <SectionReveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-black text-[#A47018] uppercase tracking-wider block mb-1">
              {language === 'ar' ? 'وفر أكثر مع الرفقة' : 'Save More With Al-Rufqah'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              {t.navOffers}
            </h2>
          </div>

          <button
            onClick={() => navigateTo('offers')}
            className="text-xs font-bold text-[#A47018] hover:text-[#7F540C] flex items-center gap-1"
          >
            <span>{t.viewAllOffers}</span>
            {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5 text-[#C9922C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#C9922C]" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.slice(0, 3).map((offer) => (
            <SectionReveal>
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-[#EDE4D3] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between hover:border-[#C9922C]/40 card-hover"
            >
              <div className="relative h-44 w-full">
                <img
                  src={offer.image}
                  alt={offer.title[language]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 start-3 px-3 py-1 rounded-full gold-gradient-bg text-[#1C1917] font-black text-xs shadow-xs border border-[#E9C682]">
                  {offer.discount}
                </span>
                <span className="absolute bottom-3 end-3 px-2.5 py-0.5 rounded-md bg-[#1C1917]/85 backdrop-blur-xs text-amber-200 text-[10px] font-bold border border-[#C9922C]/30">
                  {offer.badge[language]}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-stone-900 mb-1">{offer.title[language]}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{offer.description[language]}</p>
                </div>

                <div className="pt-3 border-t border-[#EFE8DC] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-[#FAF3E8] px-3 py-1.5 rounded-lg border border-[#ECD9BA]">
                    <Tag className="w-3.5 h-3.5 text-[#C9922C]" />
                    <span className="font-mono font-bold text-xs text-stone-900">{offer.code}</span>
                  </div>

                  <button
                    onClick={() => {
                      applyPromoCode(offer.code);
                      navigateTo('fleet');
                    }}
                    className="text-xs font-bold text-[#A47018] hover:text-[#7F540C] bg-[#FAF3E8] hover:bg-[#F5E8D2] px-3.5 py-1.5 rounded-lg transition-colors border border-[#ECD9BA]"
                  >
                    {language === 'ar' ? 'استخدم العرض' : 'Redeem Offer'}
                  </button>
                </div>
              </div>
            </div>
            </SectionReveal>
          ))}
        </div>
      </section>
      </SectionReveal>

      {/* 6. PARTNERS & LOYALTY INTEGRATIONS */}
      <SectionReveal>
      <section className="bg-[#F5EFE6] py-12 px-4 sm:px-6 lg:px-8 border-y border-[#EDE4D3]">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <span className="text-xs font-bold text-[#8C827A] uppercase tracking-wider">
            {language === 'ar' ? 'شركاء النجاح وبرامج المكافآت' : 'Official Loyalty & Rewards Partners'}
          </span>

          <div className="logo-marquee">
            <div className="logo-marquee-track">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
                <div key={`${p.id}-${i}`} className="flex items-center bg-transparent px-2 py-1">
                  <img src={p.img} alt={language === 'ar' ? p.ar : p.en} className="h-9 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </SectionReveal>

      {/* 7. DOWNLOAD APP BANNER */}
      <SectionReveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-[#2E2822] shadow-xl">
          <img
            src={bannerBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-tr from-[#141210]/95 via-[#141210]/80 to-black/70"
            aria-hidden="true"
          ></div>

          <div className="relative space-y-4">
            <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider">
              {language === 'ar' ? 'تطبيق الجوال' : 'Mobile Application'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">{t.appTitle}</h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">{t.appSubtitle}</p>

            <div className="flex flex-wrap gap-3 pt-3 items-center">
              <a
                href="#"
                className="w-36 h-12 bg-transparent hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center p-1"
                aria-label="App Store"
              >
                <img src={appStoreImg} alt="App Store" className="h-10 w-32 object-contain" />
              </a>
              <a
                href="#"
                className="w-36 h-12 bg-transparent hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center p-1"
                aria-label="Google Play"
              >
                <img src={googlePlayImg} alt="Google Play" className="h-10 w-32 object-contain" />
              </a>
            </div>
          </div>

          {/* Mobile app image */}
          <div className="relative flex justify-center">
            <img
              src={mobileImg}
              alt={language === 'ar' ? 'تطبيق مجموعة الرفقة للجوال' : 'Al-Rufqah Group mobile app'}
              className="w-64 sm:w-80 h-auto rounded-3xl border border-[#3E3832] shadow-2xl"
              draggable={false}
            />
          </div>
        </div>
      </section>
      </SectionReveal>

      {/* 8. FAQ PREVIEW */}
      <SectionReveal>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#A47018] uppercase tracking-wider">
            {t.navFaq}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'ar' ? 'الأسئلة الأكثر شيوعاً عن التأجير' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.slice(0, 4).map((faq) => (
            <SectionReveal>
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-[#EDE4D3] p-5 shadow-xs space-y-2 text-start hover:border-[#C9922C]/40 transition-colors card-hover"
            >
              <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C9922C] shrink-0" />
                <span>{faq.question[language]}</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line ps-6">
                {faq.answer[language]}
              </p>
            </div>
            </SectionReveal>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigateTo('faq')}
            className="text-xs font-bold text-[#A47018] hover:text-[#7F540C] underline"
          >
            {language === 'ar' ? 'عرض جميع الأسئلة الشائعة والإرشادات' : 'View All FAQ & Guidelines'}
          </button>
        </div>
      </section>
      </SectionReveal>
    </div>
  );
};

