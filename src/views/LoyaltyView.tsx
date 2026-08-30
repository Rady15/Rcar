import React from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import {
  Award,
  Crown,
  Zap,
  Gift,
  CheckCircle2,
  Plane,
  Phone,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const LoyaltyView: React.FC = () => {
  const { language, t, navigateTo, loyaltyTiers } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'برنامج ولاء ومكافآت الرفقة' : 'Al-Rufqah Rewards & Loyalty'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {t.navLoyalty}
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'انضم مجاناً واكسب نقاطاً مع كل كيلومتر ويوم تأجير، واستبدل نقاطك بأيام تأجير مجانية، ترقيات فورية للسيارة، وأميال طيران مع برنامج الفرسان وقطاف.'
              : 'Join for free, earn points on every rental kilometer, and redeem rewards for free rental days, instant vehicle category upgrades, and airline miles with AlFursan.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Loyalty Tiers Grid */}
      <SectionReveal>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'ar' ? 'مستويات العضوية والمزايا الحصرية' : 'Membership Tiers & Privileges'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'ar' ? 'تدرج في المستويات لتحصل على خصومات حصرية وتفضيل في ترقية السيارات' : 'Progress through tiers to unlock VIP airport lanes and free vehicle upgrades'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loyaltyTiers.map((tier) => (
            <SectionReveal key={tier.id}>
            <div
              className={`rounded-3xl border-2 p-8 shadow-sm flex flex-col justify-between space-y-6 relative transition-all card-hover ${
                tier.id === 'platinum'
                  ? 'border-[#C9922C] bg-gradient-to-b from-[#FAF3E8] to-white shadow-xl'
                  : tier.id === 'gold'
                  ? 'border-[#E9C682] bg-white'
                  : 'border-[#EDE4D3] bg-white'
              }`}
            >
              {tier.id === 'platinum' && (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 gold-gradient-bg text-[#1C1917] text-xs font-black px-3.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-[#E9C682]">
                  {language === 'ar' ? 'العضوية المميزة VIP' : 'VIP Highest Tier'}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#DFAB44] flex items-center justify-center font-black border border-[#C9922C]/40">
                    <Crown className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-stone-500">{tier.qualifyingRentals[language]}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-stone-900">{tier.name[language]}</h3>
                  <div className="text-sm font-black text-[#A07018] mt-1">
                    {language === 'ar' ? `خصم فوري ${tier.discountPercentage}%` : `${tier.discountPercentage}% Instant Discount`}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#EDE4D3]/60 text-xs text-stone-700">
                  {tier.perks[language].map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigateTo('fleet')}
                  className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 btn-hover btn-pop ${
                    tier.id === 'platinum'
                      ? 'gold-gradient-bg hover:brightness-105 text-[#1C1917] shadow-md border border-[#E9C682]'
                      : 'bg-[#1C1917] hover:bg-[#2A2522] text-white'
                  }`}
                >
                  <span>{language === 'ar' ? 'ابدأ كسب النقاط الآن' : 'Start Earning Points'}</span>
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
