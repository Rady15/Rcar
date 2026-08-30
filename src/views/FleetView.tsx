import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CarCard } from '../components/CarCard';
import { SectionReveal } from '../components/SectionReveal';
import { CarCategory } from '../types';
import {
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Car,
  Fuel,
  Users,
  RotateCcw
} from 'lucide-react';

export const FleetView: React.FC = () => {
  const { language, t, searchCriteria, updateSearchCriteria, cars } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>(
    searchCriteria.selectedCategory || 'all'
  );
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popular'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(800);

  const categories: { id: CarCategory; label: string }[] = [
    { id: 'all', label: t.catAll },
    { id: 'economy', label: t.catEconomy },
    { id: 'sedan', label: t.catSedan },
    { id: 'suv', label: t.catSuv },
    { id: 'luxury', label: t.catLuxury },
    { id: 'family', label: t.catFamily },
    { id: 'commercial', label: t.catCommercial }
  ];

  // Filter cars
  const filteredCars = cars.filter((car) => {
    // Category match
    if (selectedCategory !== 'all' && car.category !== selectedCategory) return false;

    // Fuel filter
    if (selectedFuel !== 'all' && car.fuelType !== selectedFuel) return false;

    // Price range
    if (car.dailyPrice > maxPrice) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName =
        car.name.ar.toLowerCase().includes(q) ||
        car.name.en.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q);
      if (!matchName) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.dailyPrice - b.dailyPrice;
    if (sortBy === 'price_desc') return b.dailyPrice - a.dailyPrice;
    if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedFuel('all');
    setSearchQuery('');
    setMaxPrice(800);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <SectionReveal>
        <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider">
            {language === 'ar' ? 'أسطول مجموعة الرفقة 2025' : 'Al-Rufqah Fleet 2025'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{t.navFleet}</h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'اختر سيارتك من بين أكثر من 15 فئة وموديلاً حديثاً، معقمة ومفحوصة بالكامل مع استلام فوري في كافة مطارات ومدن المملكة.'
              : 'Choose from over 15 modern vehicle models, fully inspected, sanitized, and available for immediate keyless pickup at all KSA airport terminals.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Control Bar: Categories, Search, Filters */}
      <SectionReveal>
        <div className="bg-white rounded-2xl p-5 border border-[#EDE4D3] shadow-sm space-y-4">
        {/* Category horizontal tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  updateSearchCriteria({ selectedCategory: cat.id });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'gold-gradient-bg text-[#1C1917] shadow-md shadow-[#C9922C]/20 font-black border border-[#E9C682]'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#F5EFE6] border border-[#EDE4D3]/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#EDE4D3]/60">
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث بالاسم (كامري، أكسنت، تاهو...)' : 'Search car by name or brand...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute top-3 end-3 pointer-events-none" />
          </div>

          {/* Fuel type */}
          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
          >
            <option value="all">{language === 'ar' ? 'جميع أنواع الوقود' : 'All Fuel Types'}</option>
            <option value="petrol">{t.fuelPetrol}</option>
            <option value="hybrid">{t.fuelHybrid}</option>
            <option value="electric">{t.fuelElectric}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
          >
            <option value="popular">{language === 'ar' ? 'الترتيب: الأكثر طلباً' : 'Sort: Most Popular'}</option>
            <option value="price_asc">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
            <option value="price_desc">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
          </select>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-stone-600 shrink-0">
              {maxPrice} {t.sar}
            </span>
            <input
              type="range"
              min="100"
              max="800"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C9922C] cursor-pointer"
            />
          </div>
        </div>
      </div>
      </SectionReveal>

      {/* Results Count & Reset button */}
      <SectionReveal>
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <div>
          {language === 'ar'
            ? `عرض ${filteredCars.length} سيارة متاحة للاستلام`
            : `Showing ${filteredCars.length} vehicles available for pickup`}
        </div>

        {(selectedCategory !== 'all' || selectedFuel !== 'all' || searchQuery || maxPrice < 800) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[#A07018] font-bold hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
          </button>
        )}
      </div>

      {/* Fleet Cards Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <SectionReveal>
            <CarCard key={car.id} car={car} />
            </SectionReveal>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EDE4D3] p-12 text-center space-y-4 max-w-md mx-auto">
          <Car className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">
            {language === 'ar' ? 'لا توجد سيارات مطابقة لبحثك' : 'No cars match your search'}
          </h3>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'جرّب تعديل الفلاتر أو مسح كلمة البحث لرؤية السيارات الأخرى المتاحة.'
              : 'Try adjusting your filters or resetting the search to see other available vehicles.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl btn-hover btn-pop bg-[#1C1917] text-[#DFAB44] text-xs font-bold border border-[#3E3832]"
          >
            {language === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
          </button>
        </div>
      )}
      </SectionReveal>
    </div>
  );
};
