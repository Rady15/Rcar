import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_LIST } from '../data/branches';
import { CarCategory } from '../types';
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  Search,
  Check,
  Plane,
  Building,
  RotateCcw
} from 'lucide-react';

interface BookingSearchWidgetProps {
  compact?: boolean;
  onSearchSubmit?: () => void;
}

export const BookingSearchWidget: React.FC<BookingSearchWidgetProps> = ({
  compact = false,
  onSearchSubmit
}) => {
  const {
    language,
    t,
    searchCriteria,
    updateSearchCriteria,
    navigateTo,
    appliedPromoCode,
    applyPromoCode,
    branches
  } = useApp();

  const [rentalType, setRentalType] = useState<'daily' | 'monthly'>('daily');
  const [promoInput, setPromoInput] = useState(appliedPromoCode || searchCriteria.promoCode || '');
  const [promoAppliedSuccess, setPromoAppliedSuccess] = useState(Boolean(appliedPromoCode));

  // Filter branches by selected pickup city
  const pickupBranchesInCity = branches.filter(
    (b) => b.city.en.toLowerCase() === searchCriteria.pickupCity.toLowerCase()
  );

  // Filter branches by selected return city
  const returnBranchesInCity = branches.filter(
    (b) => b.city.en.toLowerCase() === searchCriteria.returnCity.toLowerCase()
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoAppliedSuccess(true);
    }
  };

  const handleSearch = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    } else {
      navigateTo('fleet');
    }
  };

  const categories: { id: CarCategory; label: string }[] = [
    { id: 'all', label: t.catAll },
    { id: 'economy', label: t.catEconomy },
    { id: 'sedan', label: t.catSedan },
    { id: 'suv', label: t.catSuv },
    { id: 'luxury', label: t.catLuxury },
    { id: 'family', label: t.catFamily }
  ];

  return (
    <div
      className={`w-full bg-white rounded-2xl shadow-xl shadow-stone-900/10 border border-[#EDE4D3] overflow-hidden ${
        compact ? 'p-4' : 'p-4 sm:p-6 lg:p-8'
      }`}
    >
      {/* Search Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE4D3] pb-4 mb-6">
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE4D3]">
          <button
            type="button"
            onClick={() => setRentalType('daily')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              rentalType === 'daily'
                ? 'gold-gradient-bg text-[#1C1917] font-black shadow-sm border border-[#E9C682]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.tabDaily}
          </button>
          <button
            type="button"
            onClick={() => {
              setRentalType('monthly');
              navigateTo('subscription');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              rentalType === 'monthly'
                ? 'gold-gradient-bg text-[#1C1917] font-black shadow-sm border border-[#E9C682]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>{t.tabMonthly}</span>
              <span className="text-[10px] bg-[#1C1917] text-[#DFAB44] px-1.5 py-0.5 rounded font-black">
                {language === 'ar' ? 'توفير 35%' : '35% OFF'}
              </span>
            </span>
          </button>
        </div>

        {/* Airport fast-tag shortcut */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-600">
          <Plane className="w-4 h-4 text-[#C9922C]" />
          <span>{language === 'ar' ? 'فروع المطارات متاحة 24/7' : 'Airport branches open 24/7'}</span>
        </div>
      </div>

      {/* Main Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* 1. Pickup City & Branch */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C9922C]" />
            <span>{t.pickupLocation}</span>
          </label>
          <div className="space-y-2">
            <select
              value={searchCriteria.pickupCity}
              onChange={(e) => {
                const newCity = e.target.value;
                const firstBranch = branches.find(
                  (b) => b.city.en.toLowerCase() === newCity.toLowerCase()
                );
                updateSearchCriteria({
                  pickupCity: newCity,
                  pickupBranchId: firstBranch ? firstBranch.id : ''
                });
              }}
              className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C] transition-all"
            >
              {CITIES_LIST.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name[language]}
                </option>
              ))}
            </select>

            <select
              value={searchCriteria.pickupBranchId}
              onChange={(e) => updateSearchCriteria({ pickupBranchId: e.target.value })}
              className="w-full bg-white border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            >
              {pickupBranchesInCity.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.type === 'airport' ? '✈️ ' : '🏢 '}
                  {b.name[language]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Return Location (or Same location) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[#C9922C]" />
              <span>{t.returnLocation}</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-stone-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={searchCriteria.returnToDifferentLocation}
                onChange={(e) =>
                  updateSearchCriteria({ returnToDifferentLocation: e.target.checked })
                }
                className="rounded border-[#EDE4D3] text-[#C9922C] focus:ring-[#C9922C] w-3.5 h-3.5 accent-[#C9922C]"
              />
              <span>{language === 'ar' ? 'مدينة/فرع آخر' : 'Different Dropoff'}</span>
            </label>
          </div>

          {searchCriteria.returnToDifferentLocation ? (
            <div className="space-y-2 animate-in fade-in duration-200">
              <select
                value={searchCriteria.returnCity}
                onChange={(e) => {
                  const newCity = e.target.value;
                  const firstBranch = branches.find(
                    (b) => b.city.en.toLowerCase() === newCity.toLowerCase()
                  );
                  updateSearchCriteria({
                    returnCity: newCity,
                    returnBranchId: firstBranch ? firstBranch.id : ''
                  });
                }}
                className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name[language]}
                  </option>
                ))}
              </select>

              <select
                value={searchCriteria.returnBranchId}
                onChange={(e) => updateSearchCriteria({ returnBranchId: e.target.value })}
                className="w-full bg-white border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
              >
                {returnBranchesInCity.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.type === 'airport' ? '✈️ ' : '🏢 '}
                    {b.name[language]}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="h-[78px] rounded-xl bg-[#FAF7F2] border border-dashed border-[#EDE4D3] flex flex-col justify-center items-center text-center p-2 text-xs text-stone-500">
              <Building className="w-4 h-4 text-stone-400 mb-1" />
              <span>
                {language === 'ar'
                  ? 'التسليم في نفس فرع الاستلام'
                  : 'Same pickup branch for return'}
              </span>
            </div>
          )}
        </div>

        {/* 3. Pickup Date & Time */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C9922C]" />
            <span>{t.pickupDate}</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="date"
              value={searchCriteria.pickupDate}
              onChange={(e) => updateSearchCriteria({ pickupDate: e.target.value })}
              className="col-span-3 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
            <select
              value={searchCriteria.pickupTime}
              onChange={(e) => updateSearchCriteria({ pickupTime: e.target.value })}
              className="col-span-2 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-2 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            >
              {[
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00'
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Return Date & Time */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C9922C]" />
            <span>{t.returnDate}</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="date"
              value={searchCriteria.returnDate}
              onChange={(e) => updateSearchCriteria({ returnDate: e.target.value })}
              className="col-span-3 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
            <select
              value={searchCriteria.returnTime}
              onChange={(e) => updateSearchCriteria({ returnTime: e.target.value })}
              className="col-span-2 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-2 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            >
              {[
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00'
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Promo / Search Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 border-t border-[#EDE4D3]">
        {/* Category Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = searchCriteria.selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateSearchCriteria({ selectedCategory: cat.id })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#DFAB44] border border-[#C9922C]/50 shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F5EFE6] border border-[#EDE4D3]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Promo Code & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleApplyPromo} className="relative flex items-center">
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder={t.promoCodePlaceholder}
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoAppliedSuccess(false);
                }}
                className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30"
              />
              <Tag className="w-3.5 h-3.5 text-stone-400 absolute top-2.5 end-2.5 pointer-events-none" />
            </div>
            {promoInput && !promoAppliedSuccess && (
              <button
                type="submit"
                className="ms-1.5 px-3 py-2 bg-[#1C1917] hover:bg-stone-800 text-[#DFAB44] rounded-xl text-xs font-bold transition-colors shrink-0 border border-[#3E3832]"
              >
                {language === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            )}
            {promoAppliedSuccess && (
              <span className="ms-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg shrink-0 border border-emerald-200">
                <Check className="w-3 h-3" />
                <span>{language === 'ar' ? 'مفعل' : 'Active'}</span>
              </span>
            )}
          </form>

          <button
            type="button"
            onClick={handleSearch}
            className="gold-gradient-bg hover:brightness-105 text-[#1C1917] px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-[#C9922C]/20 active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#E9C682]"
          >
            <Search className="w-4 h-4 stroke-[2.5] text-[#1C1917]" />
            <span>{t.searchCarsBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
