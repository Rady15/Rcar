import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Phone,
  Zap,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Car,
  Fuel,
  Wrench,
  BatteryCharging
} from 'lucide-react';

export const RoadsideAssistanceModal: React.FC = () => {
  const { language, isRoadsideModalOpen, closeRoadsideModal, showToast } = useApp();
  const [serviceType, setServiceType] = useState<string>('flat_tire');
  const [driverName, setDriverName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [currentCity, setCurrentCity] = useState(language === 'ar' ? 'الرياض' : 'Riyadh');
  const [submitted, setSubmitted] = useState(false);

  if (!isRoadsideModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      'success',
      language === 'ar' ? 'تم إرسال فريق الطوارئ' : 'Rescue Team Dispatched',
      language === 'ar'
        ? 'تم توجيه أقرب مركبة دعم فني لموقعك. الوقت التقديري للوصول: 18 دقيقة.'
        : 'Emergency technical unit dispatched. Estimated time of arrival: 18 mins.'
    );
  };

  const services = [
    { id: 'flat_tire', title: language === 'ar' ? 'تغيير أو إصلاح إطار (بنشر)' : 'Flat Tire Replacement', icon: Wrench },
    { id: 'battery', title: language === 'ar' ? 'اشتراك / شحن بطارية' : 'Battery Jumpstart', icon: BatteryCharging },
    { id: 'fuel', title: language === 'ar' ? 'توصيل وتعبئة وقود طارئ' : 'Emergency Fuel Delivery', icon: Fuel },
    { id: 'towing', title: language === 'ar' ? 'سطحة ونقل سيارة متعطلة' : 'Towing & Recovery Flatbed', icon: Car },
    { id: 'lockout', title: language === 'ar' ? 'فتح الأبواب (المفتاح بالداخل)' : 'Car Lockout Assistance', icon: Zap }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white p-6 relative border-b border-[#C9922C]/20">
          <button
            onClick={closeRoadsideModal}
            className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#C9922C]/20 text-[#DFAB44]">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#DFAB44]">
              {language === 'ar' ? 'طوارئ الرفقة 24/7' : 'Al-Rufqah 24/7 Roadside Rescue'}
            </span>
          </div>
          <h3 className="text-xl font-black text-white">
            {language === 'ar' ? 'طلب مساعدة فورية على الطريق' : 'Request Instant Roadside Help'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            {language === 'ar'
              ? 'خدمة مجانية على مدار الساعة لكافة عملاء مجموعة الرفقة في جميع طرق المملكة.'
              : 'Free 24/7 emergency service across all highways and cities in Saudi Arabia.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {language === 'ar' ? 'نوع المشكلة أو المساعدة المطلوبة' : 'Type of Assistance Needed'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((s) => {
                    const Icon = s.icon;
                    const isSelected = serviceType === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setServiceType(s.id)}
                        className={`p-3 rounded-xl border text-start flex items-center gap-2.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#C9922C] bg-[#FAF3E8] text-[#422C05] ring-2 ring-[#C9922C]/20'
                            : 'border-[#EDE4D3] hover:bg-[#FAF7F2] text-stone-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C9922C]' : 'text-stone-400'}`} />
                        <span>{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'اسم السائق / المستأجر' : 'Driver Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full Name'}
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'رقم لوحة المركبة أو العقد' : 'Plate / Contract No.'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="RUF-XXXX / 1234"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'المدينة / الموقع التقريبي' : 'City / Location'}
                </label>
                <input
                  type="text"
                  required
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: طريق الملك فهد بالقرب من مخرج 10' : 'e.g. King Fahd Rd near Exit 10'}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:920078372"
                  className="flex-1 py-3 px-4 rounded-xl border border-[#EDE4D3] bg-[#FAF7F2] hover:bg-[#F5EFE6] text-stone-800 text-xs font-black flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C9922C]" />
                  <span>{language === 'ar' ? 'اتصال مباشر 9200' : 'Call Dispatch'}</span>
                </a>

                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs font-black shadow-md shadow-[#C9922C]/20 transition-all flex items-center justify-center gap-2 border border-[#E9C682]"
                >
                  <Zap className="w-4 h-4 fill-[#1C1917]" />
                  <span>{language === 'ar' ? 'إرسال طلب النجدة' : 'Dispatch Rescue'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto animate-pulse border border-[#ECD9BA]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-black text-lg text-stone-900">
                  {language === 'ar' ? 'تم استلام طلبك وتوجيه السطحة والدعم' : 'Help is on the Way!'}
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                  {language === 'ar'
                    ? `فريق الدعم الفني لمجموعة الرفقة في طريقه إليك في ${currentCity}. سيتصل بك الفني على جوالك خلال دقيقتين.`
                    : `Our service unit is navigating to ${currentCity}. The technician will call your phone in 2 minutes.`}
                </p>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE4D3] text-xs font-semibold text-stone-700 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#C9922C]" />
                <span>{language === 'ar' ? 'الوقت المتوقع للوصول: 18 - 25 دقيقة' : 'ETA: 18 - 25 Minutes'}</span>
              </div>

              <button
                onClick={closeRoadsideModal}
                className="px-6 py-2 rounded-xl bg-[#1C1917] text-[#DFAB44] text-xs font-bold border border-[#3E3832]"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
