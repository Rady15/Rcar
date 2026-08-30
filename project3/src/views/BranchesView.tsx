import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import { CITIES_LIST } from '../data/branches';
import { Branch } from '../types';
import {
  MapPin,
  Phone,
  Clock,
  Plane,
  Building,
  Navigation,
  Search,
  CheckCircle2,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';

export const BranchesView: React.FC = () => {
  const { language, t, updateSearchCriteria, navigateTo, branches } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [branchType, setBranchType] = useState<'all' | 'airport' | 'downtown'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBranches = branches.filter((b) => {
    if (selectedCity !== 'all' && b.city.en.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (branchType !== 'all' && b.type !== branchType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.name.ar.toLowerCase().includes(q) ||
        b.name.en.toLowerCase().includes(q) ||
        b.city.ar.toLowerCase().includes(q) ||
        b.city.en.toLowerCase().includes(q) ||
        b.address.ar.toLowerCase().includes(q) ||
        b.address.en.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleBookFromBranch = (branch: Branch) => {
    updateSearchCriteria({
      pickupCity: branch.city.en,
      pickupBranchId: branch.id,
      returnCity: branch.city.en,
      returnBranchId: branch.id
    });
    navigateTo('fleet');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider">
            {language === 'ar' ? 'شبكة الفروع في المملكة' : 'Nationwide Network in KSA'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{t.navBranches}</h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'أكثر من 50 فرعاً تغطي كافة مطارات المملكة الدولية والمحلية والمدن الرئيسية، مع خدمة استلام سريعة ودعم على مدار الساعة.'
              : 'Over 50 branches covering all international and domestic airports and major cities in Saudi Arabia, with express pickup and 24/7 support.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* City & Type Filters */}
      <SectionReveal>
      <div className="bg-white rounded-2xl p-5 border border-[#EDE4D3] shadow-sm space-y-4">
        {/* Type pills: All, Airports, Downtown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4D3]/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBranchType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                branchType === 'all'
                  ? 'bg-[#1C1917] text-[#DFAB44] shadow-xs border border-[#3E3832]'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F5EFE6] border border-[#EDE4D3]'
              }`}
            >
              {language === 'ar' ? 'كافة الفروع' : 'All Branches'}
            </button>
            <button
              onClick={() => setBranchType('airport')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                branchType === 'airport'
                  ? 'gold-gradient-bg text-[#1C1917] font-black border border-[#E9C682] shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F5EFE6] border border-[#EDE4D3]'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{t.allAirports}</span>
            </button>
            <button
              onClick={() => setBranchType('downtown')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                branchType === 'downtown'
                  ? 'gold-gradient-bg text-[#1C1917] font-black border border-[#E9C682] shadow-xs'
                  : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F5EFE6] border border-[#EDE4D3]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{t.allDowntown}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث باسم الفرع أو الحي...' : 'Search branch or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute top-3 end-3 pointer-events-none" />
          </div>
        </div>

        {/* Cities horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCity === 'all'
                ? 'bg-[#FAF3E8] text-[#A07018] border border-[#ECD9BA]'
                : 'text-stone-600 hover:bg-[#FAF7F2]'
            }`}
          >
            {language === 'ar' ? 'جميع المدن' : 'All Cities'}
          </button>
          {CITIES_LIST.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.id.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#FAF3E8] text-[#A07018] border border-[#ECD9BA]'
                    : 'text-stone-600 hover:bg-[#FAF7F2]'
                }`}
              >
                {city.name[language]}
              </button>
            );
          })}
        </div>
      </div>
      </SectionReveal>

      {/* Branches Cards Grid */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <SectionReveal key={branch.id}>
          <div
            className="bg-white rounded-2xl border border-[#EDE4D3] shadow-sm hover:shadow-lg transition-all card-hover p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Type Badge & Rating */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                    branch.type === 'airport'
                      ? 'bg-[#FAF3E8] text-[#A07018] border border-[#ECD9BA]'
                      : 'bg-[#FAF7F2] text-stone-800 border border-[#EDE4D3]'
                  }`}
                >
                  {branch.type === 'airport' ? <Plane className="w-3 h-3 text-[#C9922C]" /> : <Building className="w-3 h-3 text-[#C9922C]" />}
                  <span>{branch.city[language]} • {branch.type === 'airport' ? 'المطار' : 'المدينة'}</span>
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                  <Star className="w-3.5 h-3.5 text-[#C9922C] fill-[#C9922C]" />
                  <span>{branch.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-stone-900">{branch.name[language]}</h3>

              <p className="text-xs text-stone-500 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9922C] shrink-0 mt-0.5" />
                <span>{branch.address[language]}</span>
              </p>

              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-[#EDE4D3]/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C9922C]" />
                  <span className="font-semibold">{branch.workingHours[language]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{branch.phone}</span>
                </div>
              </div>


            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EDE4D3]/60 flex items-center gap-2">
              <a
                href={branch.googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[#EDE4D3] text-stone-600 hover:bg-[#FAF7F2] transition-colors"
                title="Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => handleBookFromBranch(branch)}
                className="flex-1 py-2.5 px-4 gold-gradient-bg hover:brightness-105 text-[#1C1917] rounded-xl text-xs font-black shadow-md shadow-[#C9922C]/20 transition-all btn-hover btn-pop flex items-center justify-center gap-1.5 border border-[#E9C682]"
              >
                <Zap className="w-3.5 h-3.5 fill-[#1C1917]" />
                <span>{language === 'ar' ? 'احجز من هذا الفرع' : 'Book From Here'}</span>
              </button>
            </div>
          </div>
          </SectionReveal>
        ))}
      </div>
      </SectionReveal>
    </div>
  );
};
