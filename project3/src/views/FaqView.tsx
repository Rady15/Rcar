import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CreditCard,
  ShieldAlert,
  Car,
  Plane
} from 'lucide-react';

export const FaqView: React.FC = () => {
  const { language, t, navigateTo, openRoadsideModal, faqs } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [id: string]: boolean }>({ 'faq-1': true, 'faq-2': true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        faq.question.ar.toLowerCase().includes(q) ||
        faq.question.en.toLowerCase().includes(q) ||
        faq.answer.ar.toLowerCase().includes(q) ||
        faq.answer.en.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: language === 'ar' ? 'جميع الأسئلة' : 'All Questions' },
    { id: 'general', label: language === 'ar' ? 'شروط ومتطلبات التأجير' : 'Requirements' },
    { id: 'booking', label: language === 'ar' ? 'الحجز والاستلام الذكي' : 'Booking & Self-Service' },
    { id: 'insurance', label: language === 'ar' ? 'التأمين والحوادث' : 'Insurance & Accidents' },
    { id: 'payment', label: language === 'ar' ? 'المدفوعات والمخالفات' : 'Payments & Traffic Fines' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl border border-[#C9922C]/20 space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider inline-flex items-center gap-1.5 relative z-10">
          <HelpCircle className="w-4 h-4 text-[#DFAB44]" />
          <span>{language === 'ar' ? 'مركز المساعدة والإجابات' : 'Help & Answers Center'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white relative z-10">{t.navFaq}</h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed relative z-10">
          {language === 'ar'
            ? 'إجابات وافية ومفصلة عن كافة استفسارات تأجير السيارات، المستندات المطلوبة، توثيق العقود، وباقات التأمين.'
            : 'Comprehensive answers to all your rental questions, required documents, contract verification, and insurance policies.'}
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative pt-2 z-10">
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث في الأسئلة (تأمين، رخصة، مطار، تفويض...)' : 'Search questions (insurance, license, airport)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-stone-900 placeholder-stone-400 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C9922C] border border-[#EDE4D3]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute top-5 end-4 pointer-events-none" />
        </div>
      </div>
      </SectionReveal>

      {/* Category Tabs */}
      <SectionReveal>
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'gold-gradient-bg text-[#1C1917] shadow-md shadow-[#C9922C]/20 border border-[#E9C682]'
                : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-[#EDE4D3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      </SectionReveal>

      {/* Accordion List */}
      <SectionReveal>
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openItems[faq.id];
          return (
            <SectionReveal key={faq.id}>
            <div
              className="bg-white rounded-2xl border border-[#EDE4D3] shadow-xs card-hover overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full p-5 text-start flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors"
              >
                <span className="font-extrabold text-sm sm:text-base text-stone-900">
                  {faq.question[language]}
                </span>
                <span className="p-1 rounded-lg bg-[#FAF3E8] text-[#C9922C] shrink-0 border border-[#ECD9BA]">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#EDE4D3]/60 whitespace-pre-line bg-[#FAF7F2]/40">
                  {faq.answer[language]}
                </div>
              )}
            </div>
            </SectionReveal>
          );
        })}
      </div>
      </SectionReveal>

      {/* Still need help banner */}
      <SectionReveal>
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 text-center space-y-4 border border-[#EDE4D3]">
        <h3 className="font-black text-lg text-stone-900">
          {language === 'ar' ? 'هل لديك استفسار آخر لم تجد إجابته؟' : 'Still have questions?'}
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          {language === 'ar'
            ? 'فريق خدمة عملاء مجموعة الرفقة متواجد 24/7 لمساعدتك فوراً عبر الهاتف أو الواتساب أو المحادثة المباشرة.'
            : 'Our customer support team is available 24/7 via toll-free phone, WhatsApp, or live chat.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:920078372"
            className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2A2522] text-white text-xs font-bold transition-colors btn-hover btn-pop"
          >
            {language === 'ar' ? 'اتصل بنا: 9200 78372' : 'Call 9200 78372'}
          </a>
          <button
            onClick={() => navigateTo('contact')}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs font-bold shadow-xs border border-[#E9C682] btn-hover btn-pop"
          >
            {language === 'ar' ? 'صفحة التواصل والموقع' : 'Contact Page'}
          </button>
        </div>
      </div>
      </SectionReveal>
    </div>
  );
};
