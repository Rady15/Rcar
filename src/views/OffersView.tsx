import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import { Offer } from '../types';
import {
  Tag,
  Copy,
  Check,
  Zap,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Gift
} from 'lucide-react';

export const OffersView: React.FC = () => {
  const { language, t, applyPromoCode, navigateTo, offers } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = offers.filter((o) => {
    if (activeCategory === 'all') return true;
    return o.category === activeCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleRedeem = (offer: Offer) => {
    applyPromoCode(offer.code);
    navigateTo('fleet');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'عروض حصرية ومكافآت' : 'Exclusive Offers & Deals'}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{t.navOffers}</h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'وفر على حجوزاتك اليومية والشهرية مع أقوى العروض الموسمية والشراكات الاستراتيجية مع برامج الولاء الرائدة بالمملكة.'
              : 'Save on daily and monthly rentals with our highest discount vouchers and strategic airline and telecom loyalty partners.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Filter Tabs */}
      <SectionReveal>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: language === 'ar' ? 'كافة العروض' : 'All Offers' },
          { id: 'weekend', label: language === 'ar' ? 'عروض الويكند' : 'Weekend Deals' },
          { id: 'airport', label: language === 'ar' ? 'عروض المطارات' : 'Airport Specials' },
          { id: 'monthly', label: language === 'ar' ? 'التأجير الشهري' : 'Monthly Plans' },
          { id: 'partner', label: language === 'ar' ? 'شركاء الطيران والاتصالات' : 'Partners' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'gold-gradient-bg text-[#1C1917] shadow-md shadow-[#C9922C]/20 font-black border border-[#E9C682]'
                : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-[#EDE4D3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      </SectionReveal>

      {/* Offers Grid */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <SectionReveal key={offer.id}>
          <div
            className="bg-white card-hover rounded-3xl border border-[#EDE4D3] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            {/* Visual Cover */}
            <div className="relative h-48 w-full">
              <img
                src={offer.image}
                alt={offer.title[language]}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              <span className="absolute top-3 start-3 px-3 py-1 rounded-full gold-gradient-bg text-[#1C1917] font-black text-xs shadow-md border border-[#E9C682]">
                {offer.discount}
              </span>

              <span className="absolute top-3 end-3 px-2.5 py-0.5 rounded-full bg-[#1C1917]/90 backdrop-blur-xs text-[#DFAB44] text-[11px] font-bold border border-[#C9922C]/30">
                {offer.badge[language]}
              </span>

              <div className="absolute bottom-3 start-3 text-white text-[11px] font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#DFAB44]" />
                <span>
                  {language === 'ar' ? `صالح حتى ${offer.validUntil}` : `Valid until ${offer.validUntil}`}
                </span>
              </div>
            </div>

            {/* Offer Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-black text-lg text-stone-900 leading-snug">
                  {offer.title[language]}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {offer.description[language]}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#EDE4D3]/60">
                {/* Promo Code Box */}
                <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl p-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#C9922C]" />
                    <div>
                      <span className="text-[10px] text-stone-400 block leading-none">
                        {language === 'ar' ? 'رمز الكوبون' : 'Promo Code'}
                      </span>
                      <span className="font-mono font-black text-sm text-stone-900">
                        {offer.code}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(offer.code)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#EDE4D3] hover:bg-[#FAF3E8] text-xs font-bold text-stone-700 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3 h-3 text-[#A07018]" />
                        <span className="text-[#A07018] font-bold">{t.codeCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>{t.copyCode}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Redeem CTA */}
                <button
                  type="button"
                  onClick={() => handleRedeem(offer)}
                  className="w-full py-3 px-4 rounded-xl gold-gradient-bg btn-hover btn-pop hover:brightness-105 text-[#1C1917] text-xs font-black shadow-md shadow-[#C9922C]/20 transition-all flex items-center justify-center gap-2 border border-[#E9C682]"
                >
                  <Zap className="w-4 h-4 fill-[#1C1917]" />
                  <span>{language === 'ar' ? 'تطبيق الكود وحجز سيارة الآن' : 'Apply Code & Book Car'}</span>
                </button>
              </div>
            </div>
          </div>
          </SectionReveal>
        ))}
      </div>
      </SectionReveal>
    </div>
  );
};
