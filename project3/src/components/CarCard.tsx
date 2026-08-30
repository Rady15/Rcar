import React from 'react';
import { useApp } from '../context/AppContext';
import { Car } from '../types';
import { SectionReveal } from './SectionReveal';
import {
  Info,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ClassicCrestBadge,
  ClassicLeatherSeatIcon,
  ClassicVintageTrunkIcon,
  ClassicGearShiftIcon,
  ClassicFuelGaugeIcon,
  ClassicSpeedometerIcon,
  ClassicHeritageShield,
  ClassicFacetedStar
} from './ClassicIcons';
import currencyImg from '../assets/currency.png';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { language, t, openCarModal, startBooking } = useApp();

  return (
    <SectionReveal>
    <div className="group card-hover bg-white rounded-2xl border border-[#EDE4D3] hover:border-[#C9922C]/60 shadow-xs hover:shadow-xl hover:shadow-[#C9922C]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5 items-start">
        {car.isPopular && (
          <span className="gold-gradient-bg text-[#1C1917] font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs border border-[#E9C682] flex items-center gap-1.5">
            <ClassicCrestBadge className="w-3.5 h-3.5 text-[#1C1917]" />
            <span>{language === 'ar' ? 'الأكثر طلباً' : 'Popular'}</span>
          </span>
        )}
        {car.isSpecialOffer && car.discountPercentage && (
          <span className="bg-[#1C1917] text-[#DFAB44] border border-[#C9922C]/40 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1.5">
            <ClassicSpeedometerIcon className="w-3.5 h-3.5 text-[#DFAB44]" />
            <span>
              {language === 'ar'
                ? `خصم ${car.discountPercentage}%`
                : `${car.discountPercentage}% OFF`}
            </span>
          </span>
        )}
      </div>

      {/* Category chip on top end */}
      <div className="absolute top-3 end-3 z-10">
        <span className="bg-[#1C1917]/90 backdrop-blur-xs text-[#DFAB44] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#C9922C]/30 flex items-center gap-1">
          <ClassicFacetedStar className="w-2.5 h-2.5 text-[#DFAB44]" />
          <span>{car.category}</span>
        </span>
      </div>

      {/* Image Container with clean scale effect */}
      <div
        className="relative h-48 sm:h-52 w-full bg-gradient-to-b from-[#F7F2EA] to-[#FAF7F2] flex items-center justify-center p-4 cursor-pointer overflow-hidden border-b border-[#EDE4D3]"
        onClick={() => openCarModal(car)}
      >
        <img
          src={car.image}
          alt={car.name[language]}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-xs"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Car Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3
              onClick={() => openCarModal(car)}
              className="font-black text-base sm:text-lg text-stone-900 group-hover:text-[#A47018] transition-colors cursor-pointer"
            >
              {car.name[language]}
            </h3>
            <span className="text-xs font-bold text-stone-400 font-mono">{car.modelYear}</span>
          </div>

          <p className="text-xs text-stone-500 mb-4 font-medium flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t.available}</span>
            <span className="text-stone-300">•</span>
            <span>{car.engineCapacity}</span>
          </p>

          {/* Specs grid with Classic Hand-Crafted Icons */}
          <div className="grid grid-cols-4 gap-2 bg-[#FAF7F2] p-2.5 rounded-xl text-center text-xs font-semibold text-stone-700 mb-4 border border-[#EDE4D3]">
            <div className="flex flex-col items-center gap-1" title={language === 'ar' ? 'عدد المقاعد والركاب' : 'Passenger Capacity'}>
              <ClassicLeatherSeatIcon className="w-4 h-4 text-[#A47018]" />
              <span className="text-[11px] font-bold">
                {car.seats} {language === 'ar' ? 'ركاب' : 'Seats'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1" title={language === 'ar' ? 'سعة الحقائب والأمتعة' : 'Luggage Capacity'}>
              <ClassicVintageTrunkIcon className="w-4 h-4 text-[#A47018]" />
              <span className="text-[11px] font-bold">
                {car.luggage} {language === 'ar' ? 'حقائب' : 'Bags'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1" title={language === 'ar' ? 'ناقل الحركة' : 'Transmission'}>
              <ClassicGearShiftIcon className="w-4 h-4 text-[#A47018]" />
              <span className="text-[11px] font-bold">
                {car.transmission === 'auto' ? t.automatic : 'عادي'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1" title={language === 'ar' ? 'نوع الوقود والمحرك' : 'Fuel Type'}>
              <ClassicFuelGaugeIcon className="w-4 h-4 text-[#A47018]" />
              <span className="text-[11px] font-bold truncate max-w-[65px]">
                {car.fuelType === 'petrol'
                  ? t.fuelPetrol
                  : car.fuelType === 'hybrid'
                  ? t.fuelHybrid
                  : car.fuelType === 'electric'
                  ? t.fuelElectric
                  : t.fuelDiesel}
              </span>
            </div>
          </div>

          {/* Quick Feature bullets */}
          <div className="space-y-1 mb-5">
            {car.features[language].slice(0, 2).map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-stone-600 truncate"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9922C] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-4 border-t border-[#EDE4D3]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                {car.dailyPrice}
              </span>
              <span className="text-xs font-bold text-[#A47018] ms-1 inline-flex items-center gap-1"><img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'يوم' : 'Day'}</span>
            </div>
            <div className="text-end">
              <span className="text-[11px] text-stone-400 block font-medium">
                {t.vatIncluded}
              </span>
              <span className="text-xs font-bold text-stone-600 font-mono inline-flex items-center gap-1">
                {car.monthlyPrice} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'شهر' : 'Month'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => openCarModal(car)}
              className="col-span-2 py-2.5 px-2 bg-[#FAF3E8] hover:bg-[#F5E8D2] text-[#1C1917] border border-[#ECD9BA] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#A47018]" />
              <span>{t.viewDetails}</span>
            </button>

            <button
              type="button"
              onClick={() => startBooking(car)}
              className="col-span-3 py-2.5 px-3 btn-hover btn-pop gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs sm:text-sm font-black rounded-xl shadow-md shadow-[#C9922C]/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-[#E9C682] cursor-pointer"
            >
              <ClassicHeritageShield className="w-4 h-4 text-[#1C1917]" />
              <span>{t.bookCar}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </SectionReveal>
  );
};
