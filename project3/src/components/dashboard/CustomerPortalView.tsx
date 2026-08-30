import React, { useEffect } from 'react';
import {
  CalendarCheck,
  Award,
  QrCode,
  KeyRound,
  ShieldCheck,
  Clock,
  FileText,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingDetails } from '../../types';

interface CustomerPortalViewProps {
  onViewInvoice: (booking: BookingDetails) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({ onViewInvoice }) => {
const { language, userBookings, refreshUserBookings, currentUser, openRoadsideModal, showToast } = useApp();

  useEffect(() => { void refreshUserBookings(); }, [refreshUserBookings]);

  return (
    <div className="space-y-6">
      {/* Loyalty Card & VIP Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-[#141210] via-[#2A2318] to-[#141210] border border-[#C9922C]/40 shadow-2xl text-stone-900 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#FAF3E8]/10 text-[#DFAB44] text-[11px] font-black border border-[#C9922C]/30 flex items-center gap-1.5 w-fit">
                <Award className="w-3.5 h-3.5" />
                <span>عضوية الرفاهة بلاتينيوم (VIP Tier)</span>
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-3">أهلاً بك، {currentUser.fullName}</h2>
              <p className="text-xs text-stone-300 mt-1">
                استمتع بخصم 15% دائم، ترقية مجانية لفئة أعلى، وتفويض تم فوري بدون انتظار.
              </p>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-stone-400 block">رصيد نقاط الولاء:</span>
              <span className="text-3xl font-black text-[#DFAB44] font-mono">1,850</span>
              <span className="text-[10px] text-stone-400 block">= 185 ر.س رصيد مجاني</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => showToast('تم استبدال 500 نقطة بخصم 50 ر.س على حجزك القادم!', 'success')}
              className="py-2 px-4 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20"
            >
              <Gift className="w-4 h-4" />
              <span>استبدال النقاط بمكافآت</span>
            </button>
            <button
              type="button"
              onClick={openRoadsideModal}
              className="py-2 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>طلب مساعدة على الطريق SOS</span>
            </button>
          </div>
        </div>

        {/* Smart Kiosk Digital Key QR Box */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xl flex flex-col items-center justify-between text-center space-y-4">
          <div>
            <span className="text-xs font-bold text-[#DFAB44] flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>المفتاح الرقمي للاستلام الذاتي</span>
            </span>
            <p className="text-[11px] text-stone-400 mt-1">
              امسح الكود عند جهاز الخدمة الذاتية في المطار لاستلام المفتاح خلال 30 ثانية
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl shadow-lg">
            <QrCode className="w-28 h-28 text-stone-900" />
          </div>

<div className="text-[10px] font-mono text-stone-400">
              <span className="text-emerald-400 font-bold">متاح عند كاونتر الفرع</span>
            </div>
        </div>
      </div>

      {/* Customer Active Bookings */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-[#DFAB44]" />
          <span>عقودي وحجوزاتي النشطة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userBookings.map((b) => {
            const pickupStr = b.searchCriteria?.pickupDate || b.createdAt?.split('T')[0] || '';
            const returnStr = b.searchCriteria?.returnDate || '';
            const totalAmt = b.payment?.totalAmount ?? 0;
            const refNum = b.tammAuthorizationNumber || 'بانتظار التوثيق الداخلي';

            return (
              <div
                key={b.bookingId}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#DFAB44]">{b.bookingId}</span>
                    <h4 className="font-black text-stone-900 text-base mt-0.5">
                      {b.car?.name ? (language === 'ar' ? b.car.name.ar : b.car.name.en) : 'سيارة'}
                    </h4>
                    <div className="text-xs text-stone-400 font-mono">لوحة: {b.car?.plateNumber || '—'}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    {b.status === 'completed' ? 'مكتمل' : 'مؤكد ونشط'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">تاريخ الاستلام والتسليم:</span>
                    <span className="font-mono text-stone-900">{pickupStr} {returnStr ? `➔ ${returnStr}` : ''}</span>
                  </div>
                  <div className="flex justify-between">
<span className="text-stone-400">مرجع التوثيق الداخلي:</span>
                    <span className="font-mono text-emerald-400 font-bold">{refNum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">إجمالي المدفوع:</span>
                    <span className="font-mono text-[#DFAB44] font-bold">{totalAmt.toLocaleString()} ر.س</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => onViewInvoice(b)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-white text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#DFAB44]" />
                    <span>تحميل الفاتورة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


