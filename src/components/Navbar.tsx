import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';
import logoImg from '../assets/arafgha-logo.png';
import { MountTransition } from './MountTransition';
import {
  Phone,
  Globe,
  Menu,
  X,
  Zap,
  CalendarCheck,
  Key,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, currentPage, navigateTo, openRoadsideModal, isAuthenticated, logout, authUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'fleet', label: t.navFleet },
    { id: 'branches', label: t.navBranches },
    { id: 'offers', label: t.navOffers },
    { id: 'corporate', label: t.navCorporate },
    { id: 'blog', label: t.navBlog },
    { id: 'subscription', label: t.navSubscription }
  ];

  const secondaryNavItems: { id: PageId; label: string }[] = [
    { id: 'used-cars', label: t.navUsedCars },
    { id: 'loyalty', label: t.navLoyalty },
    { id: 'manage-booking', label: t.navManageBooking },
    { id: 'about', label: t.navAbout },
    { id: 'faq', label: t.navFaq },
    { id: 'contact', label: t.navContact }
  ];

  const handleNavClick = (pageId: PageId) => {
    navigateTo(pageId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    navigateTo('home');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white/95 backdrop-blur-md border-b border-[#EFE8DC] transition-all">
      {/* Top Banner Bar in Alrafgha Dark Charcoal with Gold Accents */}
      <div className="bg-[#1C1917] text-stone-200 text-xs py-1.5 px-4 sm:px-8 border-b border-[#2E2822]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a
              href="tel:920078372"
              className="flex items-center gap-1.5 hover:text-[#DFAB44] transition-colors font-medium text-stone-300"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9922C]" />
              <span>{t.tollFree}</span>
            </a>

            <button
              onClick={openRoadsideModal}
              className="hidden sm:flex items-center gap-1.5 text-[#DFAB44] hover:text-amber-300 font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#C9922C]" />
              <span>{t.support24}</span>
            </button>


          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF3E8]/10 text-[#DFAB44] hover:bg-[#FAF3E8]/20 transition-colors text-xs font-black border border-[#C9922C]/30"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#DFAB44]" />
                  <span>{t.navDashboard}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold"
                  title={language === 'ar' ? 'تسجيل الخروج' : 'Log out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg gold-gradient-bg text-[#1C1917] hover:brightness-105 transition-all text-xs font-black border border-[#E9C682] shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#1C1917]" />
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('manage-booking')}
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors text-xs font-medium"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#C9922C]" />
              <span>{t.navManageBooking}</span>
            </button>

            <span className="text-stone-600">|</span>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold text-stone-200 hover:bg-stone-800 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#E2AB44]" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Alrafgha Group Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group select-none hover:opacity-95 transition-opacity"
            title="مجموعة الرفقة - ALRAFGHA GROUP"
          >
            <img
              src={logoImg}
              alt="مجموعة الرفقة - ALRAFGHA GROUP"
              style={{ width: 280, height: 'auto' }}
              className="object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'text-[#A47018] bg-[#FAF3E8] shadow-xs border border-[#ECD9BA]'
                      : 'text-[#3E3832] hover:text-[#C9922C] hover:bg-[#FAF6EE]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${
                  secondaryNavItems.some((s) => s.id === currentPage)
                    ? 'text-[#A47018] bg-[#FAF3E8] border border-[#ECD9BA]'
                    : 'text-[#3E3832] hover:text-[#C9922C] hover:bg-[#FAF6EE]'
                }`}
              >
                <span>{language === 'ar' ? 'المزيد' : 'More'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform text-[#C9922C] ${moreDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {moreDropdownOpen && (
                <div
                  className={`absolute top-full ${
                    language === 'ar' ? 'left-0' : 'right-0'
                  } mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE4D3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
                >
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-start px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                        currentPage === item.id
                          ? 'bg-[#FAF3E8] text-[#A47018] font-bold'
                          : 'text-[#3E3832] hover:bg-[#FAF6EE] hover:text-[#C9922C]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {currentPage === item.id && (
                        <span className="w-2 h-2 rounded-full bg-[#C9922C]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('fleet')}
              className="gold-gradient-bg hover:brightness-105 text-[#1C1917] px-5 py-2.5 rounded-xl font-black text-sm shadow-md shadow-[#C9922C]/25 hover:shadow-lg hover:shadow-[#C9922C]/30 transition-all active:scale-95 flex items-center gap-2 border border-[#E9C682]"
            >
              <span>{t.bookNow}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('fleet')}
              className="gold-gradient-bg text-[#1C1917] px-3.5 py-1.5 rounded-lg text-xs font-black shadow-xs"
            >
              {language === 'ar' ? 'احجز' : 'Book'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#231F20] hover:bg-[#FAF3E8] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C9922C]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Curtain backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/45 backdrop-curtain ${mobileMenuOpen ? 'backdrop-open' : 'backdrop-closed'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Navigation (slides in from the side like a curtain) */}
      <MountTransition
        open={mobileMenuOpen}
        className="lg:hidden fixed top-0 bottom-0 end-0 w-[84%] max-w-sm z-50 bg-white shadow-2xl overflow-y-auto"
      >
        <div className="px-5 pt-5 pb-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
            <span className="text-sm font-black text-[#231F20]">
              {language === 'ar' ? 'القائمة' : 'Menu'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-[#231F20] hover:bg-[#FAF3E8] focus:outline-none transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-[#C9922C]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-start px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#FAF3E8] text-[#A47018] border border-[#ECD9BA]'
                    : 'text-[#3E3832] hover:bg-[#FAF6EE]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold text-[#8C827A] px-3 uppercase tracking-wider mb-2">
              {language === 'ar' ? 'خدمات إضافية' : 'More Services'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-start px-3 py-2 rounded-lg text-xs font-medium ${
                    currentPage === item.id
                      ? 'bg-[#FAF3E8] text-[#A47018] font-bold'
                      : 'text-[#61574F] hover:bg-[#FAF6EE]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFE8DC] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full py-2.5 px-4 gold-gradient-bg text-[#1C1917] rounded-xl text-xs font-black flex items-center justify-center gap-2 border border-[#E9C682] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t.navDashboard}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log out'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 px-4 gold-gradient-bg text-[#1C1917] rounded-xl text-xs font-black flex items-center justify-center gap-2 border border-[#E9C682] transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            <button
              onClick={() => {
                openRoadsideModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#FAF3E8] hover:bg-[#F5EAD4] text-[#A47018] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#E9C682] transition-colors"
            >
              <Zap className="w-4 h-4 text-[#C9922C]" />
              <span>{t.support24}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="w-full py-2.5 px-4 bg-[#F5EFE6] hover:bg-[#EDE4D3] text-[#231F20] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Globe className="w-4 h-4 text-[#C9922C]" />
              <span>{language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}</span>
            </button>
          </div>
        </div>
      </MountTransition>
    </header>
  );
};

