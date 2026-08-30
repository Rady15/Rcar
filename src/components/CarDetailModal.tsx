import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Award
} from 'lucide-react';
import {
  ClassicLeatherSeatIcon,
  ClassicVintageTrunkIcon,
  ClassicGearShiftIcon,
  ClassicFuelGaugeIcon,
  ClassicCrestBadge,
  ClassicHeritageShield,
  ClassicFacetedStar
} from './ClassicIcons';
import currencyImg from '../assets/currency.png';

export const CarDetailModal: React.FC = () => {
  const {
    language,
    t,
    selectedCarForModal,
    closeCarModal,
    startBooking
  } = useApp();

  if (!selectedCarForModal) return null;
  const car = selectedCarForModal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white p-6 pb-24 border-b border-[#C9922C]/20">
          <button
            onClick={closeCarModal}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full gold-gradient-bg text-[#1C1917] text-xs font-black uppercase tracking-wider border border-[#E9C682]">
              {car.category}
            </span>
            <span className="text-[#DFAB44] text-xs font-semibold">
              {car.brand} • {car.modelYear}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">{car.name[language]}</h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">{car.engineCapacity}</p>
        </div>

        {/* Floating Car Visual Card */}
        <div className="px-6 -mt-16 relative z-10">
          <div className="bg-[#FAF7F2] border border-[#EDE4D3] rounded-2xl p-4 shadow-lg flex items-center justify-center h-56 sm:h-64 overflow-hidden">
            <img
              src={car.image}
              alt={car.name[language]}
              className="w-full h-full object-cover rounded-xl shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Specs & Features Grid */}
        <div className="p-6 space-y-6">
          {/* Key Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE4D3] text-center">
              <ClassicLeatherSeatIcon className="w-5 h-5 text-[#A47018] mx-auto mb-1" />
              <div className="text-xs text-stone-500">{t.seats}</div>
              <div className="font-bold text-stone-900 text-sm">{car.seats}</div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE4D3] text-center">
              <ClassicVintageTrunkIcon className="w-5 h-5 text-[#A47018] mx-auto mb-1" />
              <div className="text-xs text-stone-500">{t.luggage}</div>
              <div className="font-bold text-stone-900 text-sm">{car.luggage}</div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE4D3] text-center">
              <ClassicGearShiftIcon className="w-5 h-5 text-[#A47018] mx-auto mb-1" />
              <div className="text-xs text-stone-500">{language === 'ar' ? 'ناقل الحركة' : 'Transmission'}</div>
              <div className="font-bold text-stone-900 text-sm">
                {car.transmission === 'auto' ? t.automatic : 'عادي'}
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE4D3] text-center">
              <ClassicFuelGaugeIcon className="w-5 h-5 text-[#A47018] mx-auto mb-1" />
              <div className="text-xs text-stone-500">{language === 'ar' ? 'نوع الوقود' : 'Fuel'}</div>
              <div className="font-bold text-stone-900 text-sm truncate">
                {car.fuelType === 'petrol'
                  ? t.fuelPetrol
                  : car.fuelType === 'hybrid'
                  ? t.fuelHybrid
                  : car.fuelType === 'electric'
                  ? t.fuelElectric
                  : t.fuelDiesel}
              </div>
            </div>
          </div>

          {/* Features List */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
              <ClassicFacetedStar className="w-4 h-4 text-[#C9922C]" />
              <span>{language === 'ar' ? 'المواصفات والكماليات' : 'Features & Equipment'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {car.features[language].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE4D3]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9922C] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Terms Policy */}
          <div className="bg-[#FAF3E8] border border-[#ECD9BA] rounded-2xl p-4 text-xs text-[#61420B] space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#422C05]">
              <AlertCircle className="w-4 h-4 text-[#C9922C]" />
              <span>{language === 'ar' ? 'شروط وسياسات التأجير' : 'Rental Policy'}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#61420B]">
              <li>{t.kmPerDay}: <strong>{car.includedMileagePerDay} {language === 'ar' ? 'كم' : 'KM'}</strong></li>
              <li>{t.minAge}: <strong>{car.minDriverAge} {t.years}</strong></li>
              <li>{t.deposit}: <strong className="inline-flex items-center gap-1">{car.depositRequired} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></strong> ({language === 'ar' ? 'مسترد بالكامل فور تسليم السيارة' : 'Fully refundable upon vehicle return'})</li>
              <li>{language === 'ar' ? 'مشمول التأمين الإلزامي ضد الغير' : 'Includes Mandatory Third-Party Insurance'}</li>
            </ul>
          </div>

          {/* Pricing & Footer Actions */}
          <div className="pt-4 border-t border-[#EDE4D3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-stone-900">{car.dailyPrice}</span>
                <span className="text-xs font-bold text-[#A47018] inline-flex items-center gap-1"><img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'يوم' : 'Day'}</span>
              </div>
              <span className="text-xs text-stone-500 font-medium">{t.vatIncluded}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={closeCarModal}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-[#EDE4D3] text-xs font-bold text-stone-700 hover:bg-[#FAF7F2] transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  startBooking(car);
                }}
                className="flex-1 sm:flex-none px-7 py-3 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-sm font-black shadow-lg shadow-[#C9922C]/20 transition-all flex items-center justify-center gap-2 border border-[#E9C682]"
              >
                <ClassicHeritageShield className="w-4 h-4 text-[#1C1917]" />
                <span>{t.bookCar}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
