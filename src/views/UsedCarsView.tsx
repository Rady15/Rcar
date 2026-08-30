import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiPost } from '../lib/api';
import { SectionReveal } from '../components/SectionReveal';
import { UsedCar } from '../types';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard
} from 'lucide-react';
import {
  ClassicSpeedometerIcon,
  ClassicHeritageShield,
  ClassicCrestBadge,
  ClassicFacetedStar
} from '../components/ClassicIcons';

export const UsedCarsView: React.FC = () => {
  const { language, t, showToast, usedCars } = useApp();
  const [selectedCar, setSelectedCar] = useState<UsedCar | null>(null);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  const handleBookTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('/api/content/used-cars/test-drive', { usedCarId: selectedCar?.id, customerName, customerPhone, preferredDate });
    } catch (err: any) {
      showToast('error', language === 'ar' ? 'تعذر إرسال طلب التجربة' : 'Test drive request failed', err.message);
      return;
    }
    setTestDriveModalOpen(false);
    showToast(
      'success',
      language === 'ar' ? 'تم حجز موعد المعاينة وتجربة القيادة' : 'Test Drive Booked',
      language === 'ar'
        ? `تم تأكيد موعدك لمعاينة ${selectedCar?.name[language]} في معرض الرفقة. سيتصل بك مستشار المبيعات للتأكيد.`
        : `Your appointment for ${selectedCar?.name[language]} is confirmed. Our showroom advisor will call you.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <ClassicCrestBadge className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'معرض الرفقة للسيارات المعتمدة' : 'Al-Rufqah Certified Pre-Owned'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {t.navUsedCars}
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'سيارات مستعملة مفحوصة بدقة عبر 150 نقطة فحص فني معتمدة، خالية من الحوادث الهيكلية، مع ضمان شامل لمدة سنة وإمكانية الشراء نقداً أو بالتقسيط الميسر.'
              : 'Certified pre-owned vehicles with comprehensive 150-point technical inspection, accident-free guarantee, 1-year warranty, and flexible financing or cash purchase options.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Assurance Badges */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold shrink-0 border border-[#ECD9BA]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'فحص شامل 150 نقطة' : '150-Point Certified Inspection'}</h4>
            <p className="text-xs text-stone-500">{language === 'ar' ? 'تقرير فحص موجز معتمد' : 'Mojaz Verified History'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold shrink-0 border border-[#ECD9BA]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'ضمان ممتد لمدة سنة' : '1-Year Comprehensive Warranty'}</h4>
            <p className="text-xs text-stone-500">{language === 'ar' ? 'يشمل المحرك وناقل الحركة' : 'Engine & Transmission Coverage'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold shrink-0 border border-[#ECD9BA]">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'حلول تمويل وتقسيط بنكية' : 'Flexible Bank Financing'}</h4>
            <p className="text-xs text-stone-500">{language === 'ar' ? 'مع كافة البنوك السعودية' : 'Partnered with all major banks'}</p>
          </div>
        </div>
      </div>
      </SectionReveal>

      {/* Used Cars Grid */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usedCars.map((car) => (
          <SectionReveal key={car.id}>
          <div
            className="bg-white rounded-3xl border border-[#EDE4D3] overflow-hidden shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-[#FAF7F2]">
                <img
                  src={car.image}
                  alt={car.name[language]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full gold-gradient-bg text-[#1C1917] font-black text-xs shadow-xs border border-[#E9C682] flex items-center gap-1">
                  <ClassicHeritageShield className="w-3.5 h-3.5 text-[#1C1917]" />
                  <span>{car.warranty[language]}</span>
                </span>
                <span className="absolute top-3 end-3 px-2.5 py-0.5 rounded-full bg-[#1C1917]/85 backdrop-blur-xs text-[#DFAB44] font-bold text-xs border border-[#C9922C]/30 font-mono">
                  {car.year}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-black text-lg text-stone-900">{car.name[language]}</h3>
                  <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <ClassicSpeedometerIcon className="w-3.5 h-3.5 text-[#A47018]" />
                      {car.mileage.toLocaleString()} {language === 'ar' ? 'كم' : 'KM'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9922C]" />
                      {car.city[language]}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDE4D3]/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-stone-900">
                      {car.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-[#A07018] ms-1">{t.sar}</span>
                  </div>

                  <div className="text-end text-xs text-stone-500">
                    {language === 'ar' ? 'أو قسط شهري من' : 'Or monthly from'}{' '}
                    <strong className="text-stone-900 font-bold">
                      {Math.round(car.price / 48).toLocaleString()} {t.sar}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedCar(car);
                  setTestDriveModalOpen(true);
                }}
                className="w-full py-3 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs font-black shadow-md shadow-[#C9922C]/20 transition-all btn-hover btn-pop flex items-center justify-center gap-2 border border-[#E9C682]"
              >
                <Car className="w-4 h-4" />
                <span>{language === 'ar' ? 'حجز موعد معاينة وتجربة قيادة' : 'Book Inspection & Test Drive'}</span>
              </button>
            </div>
          </div>
          </SectionReveal>
        ))}
      </div>
      </SectionReveal>

      {/* Test Drive Modal */}
      <SectionReveal>
      {testDriveModalOpen && selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#EDE4D3]">
            <div className="flex items-center justify-between border-b border-[#EDE4D3] pb-3">
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  {language === 'ar' ? 'حجز موعد معاينة سيارة' : 'Book Vehicle Inspection'}
                </h3>
                <p className="text-xs text-stone-500">{selectedCar.name[language]} ({selectedCar.year})</p>
              </div>
              <button
                onClick={() => setTestDriveModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookTestDrive} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'الاسم الكريم' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'ar' ? 'أحمد الشمري' : 'Full Name'}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'رقم الجوال' : 'Mobile Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'تاريخ المعاينة المفضل' : 'Preferred Date'}
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] font-black text-xs shadow-md transition-all btn-hover btn-pop border border-[#E9C682]"
                >
                  {language === 'ar' ? 'تأكيد موعد المعاينة' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </SectionReveal>
    </div>
  );
};
