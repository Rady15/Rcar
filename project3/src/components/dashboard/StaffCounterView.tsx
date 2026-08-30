import React, { useEffect, useState } from 'react';
import {
  Building2,
  CalendarCheck,
  KeyRound,
  Gauge,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingDetails } from '../../types';

interface StaffCounterViewProps {
  onOpenInspection: (booking: BookingDetails, type: 'pickup' | 'return') => void;
  onViewInvoice: (booking: BookingDetails) => void;
}

export const StaffCounterView: React.FC<StaffCounterViewProps> = ({
  onOpenInspection,
  onViewInvoice
}) => {
const { language, userBookings, refreshUserBookings, currentUser, branches, issueTammAuthorization, updateBookingStatus, cancelBooking } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'pickup' | 'return'>('all');

  useEffect(() => { void refreshUserBookings(); }, [refreshUserBookings]);

  const activeBranch = branches.find((b) => b.id === currentUser.branchId) || branches[0];

  return (
    <div className="space-y-6">
      {/* Branch Counter Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1C1917] via-[#241F1A] to-[#1C1917] border border-[#C9922C]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF3E8]/10 text-[#DFAB44] text-[11px] font-black border border-[#C9922C]/30 flex items-center gap-1.5 w-fit">
            <Building2 className="w-3.5 h-3.5" />
            <span>كاونتر صالات مطار الملك خالد الدولي (T1-2)</span>
          </span>
          <h2 className="text-xl font-black text-stone-900 mt-2">
            {language === 'ar' ? 'طابور الاستلام والتسليم لليوم' : "Today's Handover Queue"}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            {language === 'ar'
              ? 'التحقق من الهوية الوطنية ورخصة القيادة، تسجيل الفحص الفني، وتسليم المفتاح الذكي.'
              : 'ID and driver license verification, digital handover inspection, and keyless activation.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all' ? 'gold-gradient-bg text-[#1C1917]' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setFilterType('pickup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'pickup' ? 'gold-gradient-bg text-[#1C1917]' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            تسليم مركبة
          </button>
          <button
            type="button"
            onClick={() => setFilterType('return')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'return' ? 'gold-gradient-bg text-[#1C1917]' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            استرجاع وفحص
          </button>
        </div>
      </div>

      {/* Handover Cards Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {userBookings.map((b) => {
          const pickupStr = b.searchCriteria?.pickupDate || b.createdAt?.split('T')[0] || 'اليوم';
          const tammNum = b.tammAuthorizationNumber || (b.tammAuthorized ? 'موثق' : 'بانتظار التوثيق');

          return (
            <div
              key={b.bookingId}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#DFAB44]">{b.bookingId}</span>
                    <h3 className="font-black text-stone-900 text-sm">{b.customer?.fullName || 'العميل'}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-50 text-[#DFAB44] text-[10px] font-mono font-bold">
                    {b.car?.plateNumber || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs text-stone-300">
                  <div className="font-bold text-stone-900">
                    {b.car?.name ? (language === 'ar' ? b.car.name.ar : b.car.name.en) : 'سيارة'}
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between">
                    <span>تاريخ الاستلام:</span>
                    <span className="font-mono text-stone-200">{pickupStr}</span>
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between">
                    <span>التوثيق الداخلي:</span>
                    <span className="font-mono text-emerald-400">{tammNum}</span>
                  </div>
                </div>
              </div>

<div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenInspection(b, 'pickup')}
                    className="flex-1 py-2 px-3 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#C9922C]/20"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>تسليم وفحص رقمي</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewInvoice(b)}
                    className="p-2 rounded-xl bg-stone-50 text-[#DFAB44] border border-stone-200"
                    title="عرض الفاتورة"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {b.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(b.bookingId, 'active')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors hover:bg-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>بدء العقد</span>
                    </button>
                  )}
                  {!(b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show') && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.bookingId)}
                      className="flex-1 py-2 px-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors hover:bg-red-500/20"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>إلغاء</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

