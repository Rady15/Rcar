import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Users,
  Building,
  Target,
  Car,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { SectionReveal } from '../components/SectionReveal';

export const AboutView: React.FC = () => {
  const { language, t, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'نبذة عن مجموعة الرفقة' : 'About Al-Rufqah Group'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {language === 'ar'
              ? 'رواد قطاع تأجير السيارات والتنقل الذكي في المملكة العربية السعودية'
              : 'Leading Smart Mobility & Car Rental in the Kingdom of Saudi Arabia'}
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'تأسست مجموعة الرفقة لتأجير السيارات لتكون الخيار الأول للمواطنين، المقيمين، وزوار المملكة من خلال تقديم أسطول عصري يضم أكثر من 25,000 مركبة حديثة، وتغطية شاملة لكافة مطارات ومدن المملكة وفق أعلى معايير الجودة وخدمة العملاء.'
              : 'Founded with a vision to redefine automotive mobility in Saudi Arabia, Al-Rufqah Group operates over 25,000 modern vehicles across all major airports and cities with a commitment to seamless digital experiences.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Vision 2030 Alignment & Mission */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-[#EDE4D3] shadow-sm card-hover space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black border border-[#ECD9BA]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-stone-900">
            {language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'ar'
              ? 'أن نكون المنظومة الرائدة إقليمياً في تقديم حلول التنقل المتكاملة والذكية، عبر رقمنة تجربة التأجير بنسبة 100%، وتمكين عملائنا من استلام مركباتهم في أقل من دقيقة واحدة بدون معاملات ورقية أو انتظار.'
              : "To be the region's undisputed leader in smart mobility solutions by digitizing 100% of the rental journey, enabling travelers to collect keys seamlessly in under one minute."}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#EDE4D3] shadow-sm card-hover space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-black border border-[#ECD9BA]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-stone-900">
            {language === 'ar' ? 'مواكبة رؤية السعودية 2030' : 'Aligned with Saudi Vision 2030'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'ar'
              ? 'نفخر بمساهمتنا في تطوير البنية التحتية لقطاع السياحة والنقل في المملكة، واستقبال ضيوف الرحمن وزوار الفعاليات والمواسم العالمية بأسطول صديق للبيئة يشمل أحدث السيارات الهجينة والكهربائية.'
              : "Proud contributors to Saudi Arabia's national tourism and logistics infrastructure, serving global travelers and pilgrim guests with an expanding green fleet of hybrid and electric vehicles."}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Numerical Achievements */}
      <SectionReveal>
      <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center border border-[#C9922C]/20 shadow-lg">
        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-[#DFAB44]">25,000+</div>
          <div className="text-xs text-stone-400 font-bold">{language === 'ar' ? 'سيارة في الأسطول' : 'Vehicles in Fleet'}</div>
        </div>

        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-[#E9C682]">50+</div>
          <div className="text-xs text-stone-400 font-bold">{language === 'ar' ? 'فرعاً في كافة المناطق' : 'Branches Nationwide'}</div>
        </div>

        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-[#DFAB44]">100%</div>
          <div className="text-xs text-stone-400 font-bold">{language === 'ar' ? 'تغطية صالات المطارات' : 'Airport Terminals'}</div>
        </div>

        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-[#E9C682]">1.2M+</div>
          <div className="text-xs text-stone-400 font-bold">{language === 'ar' ? 'عميل يثقون بنا' : 'Satisfied Clients'}</div>
        </div>
      </div>
      </SectionReveal>

      {/* Safety & Cleanliness Standards */}
      <SectionReveal>
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE4D3] shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#A07018] uppercase tracking-wider">
            {language === 'ar' ? 'معايير الجودة والسلامة' : 'Quality & Safety Standards'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'ar' ? 'راحتك وسلامتك أولويتنا المطلقة' : 'Your Safety & Comfort Come First'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE4D3] card-hover space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C9922C]" />
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'تعقيم شامل قبل كل تسليم' : 'Complete Sanitization'}</h4>
            <p className="text-xs text-stone-500 leading-relaxed">{language === 'ar' ? 'تنظيف وتعقيم متكامل للمقصورة والمكيف لضمان بيئة آمنة.' : 'Full interior deep-cleaning before every customer handover.'}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE4D3] card-hover space-y-2">
            <Clock className="w-6 h-6 text-[#A07018]" />
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'دعم فني 24/7 على الطرق' : '24/7 Roadside Rescue'}</h4>
            <p className="text-xs text-stone-500 leading-relaxed">{language === 'ar' ? 'فريق طوارئ جاهز لخدمتك في جميع مدن وطرق المملكة السريعة.' : 'Dedicated field emergency units across all KSA highways.'}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE4D3] card-hover space-y-2">
            <Award className="w-6 h-6 text-[#DFAB44]" />
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'سيارات موديل 2025 حصراً' : 'Latest 2025 Models Only'}</h4>
            <p className="text-xs text-stone-500 leading-relaxed">{language === 'ar' ? 'تجديد دوري للأسطول لضمان قيادة سيارة حديثة بأعلى مواصفات الأمان.' : 'Continuous fleet turnover ensures top safety tech and low mileage.'}</p>
          </div>
        </div>
      </div>
      </SectionReveal>
    </div>
  );
};
