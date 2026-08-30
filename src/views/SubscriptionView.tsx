import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import {
  CalendarRange,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  RotateCcw,
  Zap,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { language, t, navigateTo, startBooking, subscriptions } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // 1, 3, 6, 12 months

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <CalendarRange className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'اشتراكات السيارات الشهرية والسنوية' : 'Monthly & Long-Term Car Subscriptions'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {t.navSubscription}
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'امتلك تجربة قيادة سيارة حديثة بدون التزامات القروض البنكية أو أعباء التأمين والصيانة. ادفع اشتراكاً شهرياً ثابتاً يشمل كافة المصاريف وبإمكانية تبديل السيارة في أي وقت.'
              : 'Drive a brand new 2025 car with zero bank loan commitments, down payments, or maintenance worries. Pay a single all-inclusive monthly fee with flexibility to swap cars anytime.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Subscription Benefits */}
      <SectionReveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EDE4D3] shadow-xs text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'تأمين شامل 100%' : 'Full Comprehensive Insurance'}</h4>
          <p className="text-[11px] text-stone-500">{language === 'ar' ? 'مشمول بكافة الباقات' : 'Included in all tiers'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE4D3] shadow-xs text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'صيانة وقطع غيار مجانية' : 'Free Maintenance & Tyres'}</h4>
          <p className="text-[11px] text-stone-500">{language === 'ar' ? 'بدون أي تكاليف خفية' : 'Zero hidden costs'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE4D3] shadow-xs text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'إمكانية تبديل السيارة' : 'Flexible Vehicle Swapping'}</h4>
          <p className="text-[11px] text-stone-500">{language === 'ar' ? 'غيّر فئتك متى رغبت' : 'Swap to SUV or Luxury'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE4D3] shadow-xs text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
          </div>
          <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'بدون دفعة أولى' : 'Zero Down Payment'}</h4>
          <p className="text-[11px] text-stone-500">{language === 'ar' ? 'استلم سيارتك فوراً' : 'Instant digital activation'}</p>
        </div>
      </div>
      </SectionReveal>

      {/* Subscription Plans Grid */}
      <SectionReveal>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'ar' ? 'باقات الاشتراك المتاحة' : 'Available Subscription Packages'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'اختر الفئة الأنسب لنمط حياتك اليومي واشترك في أقل من دقيقة عبر الهوية الوطنية أو الإقامة.'
              : 'Choose the plan tailored to your lifestyle and subscribe digitally in under a minute.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptions.map((sub) => (
            <SectionReveal key={sub.id}>
            <div
              className="bg-white card-hover rounded-3xl border border-[#EDE4D3] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#A07018] uppercase">
                    {sub.tier[language]}
                  </span>
                  <span className="text-[11px] font-bold text-stone-400">2025 Models</span>
                </div>

                <div className="relative h-36 w-full rounded-2xl bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-2 border border-[#EDE4D3]/60">
                  <img
                    src={sub.image}
                    alt={sub.tier[language]}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-stone-900">{sub.monthlyPrice}</span>
                    <span className="text-xs font-bold text-[#A07018]">{t.perMonth}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">{t.vatIncluded}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EDE4D3]/60">
                  <div className="text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'أمثلة السيارات المشمولة:' : 'Sample Models:'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sub.sampleCars[language].map((car, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#FAF7F2] text-stone-700 px-2 py-0.5 rounded-md font-medium border border-[#EDE4D3]"
                      >
                        {car}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EDE4D3]/60 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sub.includedKmPerMonth} {language === 'ar' ? 'كم شهرياً' : 'KM / Month'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sub.features[language][0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sub.features[language][1]}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => navigateTo('fleet')}
                  className="w-full py-3 rounded-xl gold-gradient-bg btn-hover btn-pop hover:brightness-105 text-[#1C1917] text-xs font-black transition-all flex items-center justify-center gap-2 border border-[#E9C682] shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-[#1C1917]" />
                  <span>{language === 'ar' ? 'اشترك في هذه الباقة' : 'Subscribe to Tier'}</span>
                </button>
              </div>
            </div>
            </SectionReveal>
          ))}
        </div>
      </div>
      </SectionReveal>
    </div>
  );
};
