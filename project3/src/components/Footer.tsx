import React from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import logoImg from '../assets/arafgha-logo.png';
import madaImg from '../assets/Mada_Logo.svg.png';
import visaImg from '../assets/visa.png';
import mastercardImg from '../assets/MasterCard.png';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Clock,
  Award
} from 'lucide-react';
import { CITIES_LIST } from '../data/branches';

export const Footer: React.FC = () => {
  const { language, t, navigateTo, openRoadsideModal } = useApp();

  const handleLink = (page: PageId) => {
    navigateTo(page);
  };

  return (
    <footer className="bg-[#141210] text-stone-300 pt-16 pb-12 border-t border-[#2E2822]">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#2E2822]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1C1917]/90 border border-[#2E2822] hover:border-[#C9922C]/40 transition-colors">
            <div className="p-3 bg-[#C9922C]/15 text-[#DFAB44] rounded-xl shrink-0 border border-[#C9922C]/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{t.feature1Title}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{t.feature1Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1C1917]/90 border border-[#2E2822] hover:border-[#C9922C]/40 transition-colors">
            <div className="p-3 bg-[#C9922C]/15 text-[#DFAB44] rounded-xl shrink-0 border border-[#C9922C]/30">
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{t.feature2Title}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{t.feature2Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1C1917]/90 border border-[#2E2822] hover:border-[#C9922C]/40 transition-colors">
            <div className="p-3 bg-[#C9922C]/15 text-[#DFAB44] rounded-xl shrink-0 border border-[#C9922C]/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{t.feature3Title}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{t.feature3Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#1C1917]/90 border border-[#2E2822] hover:border-[#C9922C]/40 transition-colors">
            <div className="p-3 bg-[#C9922C]/15 text-[#DFAB44] rounded-xl shrink-0 border border-[#C9922C]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{t.feature4Title}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{t.feature4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cursor-pointer" onClick={() => handleLink('home')}>
            <img
              src={logoImg}
              alt="مجموعة الرفقة - ALRAFGHA GROUP"
              style={{ width: 'auto', height: 70 }}
              className="object-contain select-none"
              draggable={false}
            />
          </div>

          <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
            {language === 'ar'
              ? 'مجموعة الرفقة لتأجير السيارات، الخيار الأول للتنقل الذكي والراقي في كافة أرجاء المملكة العربية السعودية بأسطول حديث وخدمات فندقية رفيعة المستوى.'
              : 'ALRAFGHA GROUP Car Rental, the premier choice for smart, luxury, and reliable mobility across the Kingdom of Saudi Arabia.'}
          </p>

          {/* Direct Contacts */}
          <div className="space-y-2 pt-2 text-sm text-stone-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9922C]" />
              <span>{t.tollFree}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9922C]" />
              <span>care@alrufqah.sa</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9922C]" />
              <span>
                {language === 'ar'
                  ? 'طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية'
                  : 'King Fahd Road, Al Olaya, Riyadh, Kingdom of Saudi Arabia'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={openRoadsideModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9922C]/15 text-[#DFAB44] border border-[#C9922C]/30 text-xs font-bold hover:bg-[#C9922C]/25 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#DFAB44]" />
              <span>{t.roadAssistance}</span>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase">{t.quickLinks}</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <button
                onClick={() => handleLink('home')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navHome}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('fleet')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navFleet}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('branches')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navBranches}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('offers')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navOffers}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('manage-booking')}
                className="hover:text-[#DFAB44] transition-colors text-[#DFAB44] font-semibold"
              >
                {t.navManageBooking}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('faq')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navFaq}
              </button>
            </li>
          </ul>
        </div>

        {/* Services & Business */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase">{t.ourServices}</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <button
                onClick={() => handleLink('corporate')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navCorporate}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('subscription')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navSubscription}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('used-cars')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navUsedCars}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('blog')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navBlog}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('login')}
                className="hover:text-[#DFAB44] transition-colors text-[#DFAB44] font-bold"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('loyalty')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navLoyalty}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('about')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navAbout}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLink('contact')}
                className="hover:text-[#DFAB44] transition-colors"
              >
                {t.navContact}
              </button>
            </li>
          </ul>
        </div>

        {/* Branches in Cities */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase">
            {language === 'ar' ? 'فروعنا في المملكة' : 'Key Cities in KSA'}
          </h4>
          <div className="flex flex-wrap gap-1.5 text-xs text-stone-400">
            {CITIES_LIST.slice(0, 10).map((c) => (
              <button
                key={c.id}
                onClick={() => handleLink('branches')}
                className="px-2.5 py-1 rounded-lg bg-[#1C1917] hover:bg-[#C9922C]/20 hover:text-[#DFAB44] border border-[#2E2822] transition-colors"
              >
                {c.name[language]}
              </button>
            ))}
          </div>

          <div className="pt-3">
            <h5 className="text-xs font-semibold text-stone-300 mb-2">{t.paymentAccepted}</h5>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 py-1 bg-white rounded shadow-xs">
                <img src={madaImg} alt="mada" className="h-5 w-auto" />
              </span>
              <span className="px-1.5 py-1 bg-white rounded shadow-xs">
                <img src={visaImg} alt="Visa" className="h-5 w-auto" />
              </span>
              <span className="px-1.5 py-1 bg-white rounded shadow-xs">
                <img src={mastercardImg} alt="MasterCard" className="h-5 w-auto" />
              </span>
              <span className="px-1.5 py-1 text-xs font-bold text-stone-700">Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Compliance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#2E2822] text-xs text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-start">{t.licensedBy}</p>
        <p className="text-center md:text-end">{t.allRightsReserved}</p>
      </div>
    </footer>
  );
};

