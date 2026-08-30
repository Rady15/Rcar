import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiGet, apiPost } from '../lib/api';
import { BookingDetails } from '../types';
import { SectionReveal } from '../components/SectionReveal';
import {
  Search,
  FileText,
  Printer,
  Calendar,
  MapPin,
  Car,
  Clock,
  QrCode,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Share2
} from 'lucide-react';

export const ManageBookingView: React.FC = () => {
  const { language, t, userBookings, cancelBooking, showToast, navigateTo } = useApp();
  const [lookupRef, setLookupRef] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    userBookings.length > 0 ? userBookings[0] : null
  );

  const handleSearchBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const secret = lookupPhone.trim();
      const found = await apiPost<BookingDetails>('/api/bookings/lookup', { bookingId: lookupRef.trim(), secret });
      setSelectedBooking(found);
      showToast(
        'success',
        language === 'ar' ? 'تم العثور على الحجز' : 'Booking Found',
        language === 'ar' ? `حجز رقم ${found.bookingId}` : `Reference ${found.bookingId}`
      );
    } catch {
      showToast(
        'error',
        language === 'ar' ? 'لم يتم العثور على الحجز' : 'Booking Not Found',
        language === 'ar'
          ? 'يرجى التأكد من رقم مرجع الحجز ورقم الجوال المسجل'
          : 'Please verify the booking reference and registered mobile number'
      );
    }
  };

  const handleCancel = (bookingId: string) => {
    if (
      window.confirm(
        language === 'ar'
          ? 'هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟'
          : 'Are you sure you want to cancel this booking?'
      )
    ) {
      cancelBooking(bookingId);
      setSelectedBooking((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider">
            {language === 'ar' ? 'إدارة الحجوزات' : 'Booking Management'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{t.navManageBooking}</h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'استعلم عن حجزك، قم بطباعة قسيمة التأجير، تعديل مواعيد الاستلام أو استعراض حالة العقد الموثق بسهولة وبدون الحاجة لزيارة الفرع.'
              : 'Look up your reservation, print your rental voucher, modify pickup schedules or review your verified contract in one place.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Lookup Form */}
      <SectionReveal>
      <div className="bg-white rounded-2xl p-6 border border-[#EDE4D3] shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSearchBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              {language === 'ar' ? 'رقم مرجع الحجز' : 'Booking Reference'}
            </label>
            <input
              type="text"
              required
              placeholder="RUF-XXXXX"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              {language === 'ar' ? 'رقم الجوال المسجل' : 'Registered Mobile'}
            </label>
            <input
              type="tel"
              placeholder="05XXXXXXXX"
              value={lookupPhone}
              onChange={(e) => setLookupPhone(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 gold-gradient-bg hover:brightness-105 text-[#1C1917] rounded-xl text-xs font-black shadow-md shadow-[#C9922C]/20 transition-all btn-hover btn-pop flex items-center justify-center gap-2 border border-[#E9C682]"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ar' ? 'بحث عن الحجز' : 'Find Booking'}</span>
            </button>
          </div>
        </form>
      </div>
      </SectionReveal>

      {/* Active Selected Booking Display */}
      <SectionReveal>
      {selectedBooking ? (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#EDE4D3] shadow-xl overflow-hidden card-hover">
          {/* Header */}
          <div className="bg-[#1C1917] text-white p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#C9922C]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center text-[#1C1917] border border-[#E9C682]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-[#DFAB44] font-bold uppercase">
                  {language === 'ar' ? 'تفاصيل العقد الإلكتروني' : 'Electronic Contract'}
                </span>
                <div className="text-xl font-mono font-black text-white">{selectedBooking.bookingId}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  selectedBooking.status === 'confirmed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : selectedBooking.status === 'completed'
                    ? 'bg-[#C9922C]/20 text-[#DFAB44] border border-[#C9922C]/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {selectedBooking.status === 'confirmed'
                  ? language === 'ar' ? 'مؤكد ونشط' : 'Confirmed & Active'
                  : selectedBooking.status === 'completed'
                  ? language === 'ar' ? 'مكتمل' : 'Completed'
                  : language === 'ar' ? 'ملغي' : 'Cancelled'}
              </span>

              <button
                onClick={() => window.print()}
                className="p-2.5 rounded-xl bg-[#2A2522] hover:bg-[#38312C] text-white transition-colors border border-stone-700"
                title="Print Voucher"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle & Specs */}
              <div className="space-y-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE4D3]">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedBooking.car.image}
                    alt={selectedBooking.car.name[language]}
                    className="w-28 h-20 object-cover rounded-xl shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-black text-lg text-stone-900">
                      {selectedBooking.car.name[language]}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {selectedBooking.car.modelYear} • {selectedBooking.car.engineCapacity}
                    </p>
                    <div className="text-xs font-bold text-[#A07018] mt-1">
                      {selectedBooking.numberOfDays} {language === 'ar' ? 'أيام تأجير' : 'Rental Days'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 pt-3 border-t border-[#EDE4D3]">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'باقة الحماية:' : 'Protection Plan:'}</span>
                    <span className="font-bold text-stone-900">{selectedBooking.protectionPlan.name[language]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الكيلومترات المشمولة:' : 'Mileage Included:'}</span>
                    <span className="font-bold text-stone-900">{selectedBooking.car.includedMileagePerDay * selectedBooking.numberOfDays} KM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                    <span className="font-bold text-stone-900 uppercase">{selectedBooking.payment.method}</span>
                  </div>
                  <div className="flex justify-between text-[#A07018] font-bold pt-1 border-t border-[#EDE4D3]">
                    <span>{language === 'ar' ? 'المبلغ الإجمالي المدفوع:' : 'Total Amount Paid:'}</span>
                    <span>{selectedBooking.payment.totalAmount} {t.sar}</span>
                  </div>
                </div>
              </div>

              {/* Itinerary & QR */}
              <div className="space-y-4 bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE4D3] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-400">{t.pickupLocation}</span>
                    <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C9922C]" />
                      <span>{selectedBooking.pickupBranch.name[language]}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {selectedBooking.searchCriteria.pickupDate} ({selectedBooking.searchCriteria.pickupTime})
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#EDE4D3]">
                    <span className="text-[11px] font-bold text-stone-400">{t.returnLocation}</span>
                    <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A07018]" />
                      <span>{selectedBooking.returnBranch.name[language]}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {selectedBooking.searchCriteria.returnDate} ({selectedBooking.searchCriteria.returnTime})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EDE4D3]">
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">{language === 'ar' ? 'رمز الحجز' : 'Booking QR'}</span>
                    <span className="text-[10px] text-stone-500">{language === 'ar' ? 'اعرضه عند الاستلام' : 'Show at pickup'}</span>
                  </div>
                  <QrCode className="w-10 h-10 text-stone-800" />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            {selectedBooking.status === 'confirmed' && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCancel(selectedBooking.bookingId)}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إلغاء هذا الحجز' : 'Cancel Reservation'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs font-black shadow-xs transition-colors btn-hover btn-pop flex items-center gap-1.5 border border-[#E9C682]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'ar' ? 'طباعة القسيمة' : 'Print Voucher'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 max-w-md mx-auto space-y-4">
          <FileText className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">
            {language === 'ar' ? 'لا توجد حجوزات نشطة حالياً' : 'No Active Bookings Found'}
          </h3>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'احجز سيارتك الآن من أسطول الرفقة واستمتع بأفضل الأسعار وخدمة الاستلام السريع.'
              : 'Book your car now from Al-Rufqah fleet and enjoy the best rates with express pickup.'}
          </p>
          <button
            onClick={() => navigateTo('fleet')}
            className="px-6 py-2.5 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-bold shadow-md border border-[#E9C682] btn-hover btn-pop"
          >
            {language === 'ar' ? 'استعراض الأسطول وحجز سيارة' : 'Explore Fleet & Book'}
          </button>
        </div>
      )}
      </SectionReveal>
    </div>
  );
};
