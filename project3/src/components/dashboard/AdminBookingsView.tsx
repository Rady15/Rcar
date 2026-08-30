import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Printer,
  ShieldCheck,
Eye,
  KeyRound,
  FileText,
  UserCheck,
  Send,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingDetails } from '../../types';

interface AdminBookingsViewProps {
  onViewInvoice: (booking: BookingDetails) => void;
  onOpenInspection: (booking: BookingDetails, type: 'pickup' | 'return') => void;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  onViewInvoice,
  onOpenInspection
}) => {
const { language, userBookings, refreshUserBookings, updateBookingStatus, issueTammAuthorization, cancelBooking, deleteBooking, restoreBooking, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => { void refreshUserBookings(); }, [refreshUserBookings]);

  const filteredBookings = userBookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.customer.phone.includes(q) ||
      b.car.name.ar.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'بحث برقم الحجز أو اسم العميل أو الجوال...'
                : 'Search booking ID, customer, phone...'
            }
            className="w-full bg-white border border-stone-200 rounded-xl py-2 ps-10 pe-4 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C9922C]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: language === 'ar' ? 'جميع العقود' : 'All Bookings' },
            { id: 'confirmed', label: language === 'ar' ? 'مؤكدة ونشطة' : 'Active/Confirmed' },
            { id: 'completed', label: language === 'ar' ? 'مكتملة ومستلمة' : 'Completed' },
            { id: 'pending', label: language === 'ar' ? 'قيد التدقيق' : 'Pending' },
            { id: 'cancelled', label: language === 'ar' ? 'ملغية' : 'Cancelled' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === item.id
                  ? 'gold-gradient-bg text-[#1C1917] font-black shadow-sm'
                  : 'bg-white text-stone-400 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-white text-stone-400 border-b border-stone-200 uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'رقم الحجز والتاريخ' : 'Booking & Date'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'العميل والهاتف' : 'Customer & Phone'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'السيارة المحجوزة' : 'Vehicle'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'المدة والقيمة' : 'Duration & Total'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'التوثيق الداخلي' : 'Internal Verification'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'إجراءات ووثائق' : 'Actions & Docs'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2621] text-stone-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    {language === 'ar' ? 'لا توجد عقود مطابقة للبحث.' : 'No bookings found.'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const hasTamm = !!b.tammAuthorized || !!b.tammAuthorizationNumber;
                  const isConfirmed = b.status === 'confirmed' || b.status === 'active';
                  const isCompleted = b.status === 'completed';
                  const pickupDateStr = b.searchCriteria?.pickupDate || b.createdAt?.split('T')[0] || '—';
                  const totalAmt = b.payment?.totalAmount ?? 0;
                  const days = b.numberOfDays ?? 1;
                  const customerId = b.customer?.idNumber || '1088492019';

                  return (
                    <tr key={b.bookingId} className="hover:bg-white transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#DFAB44] text-xs">
                          {b.bookingId}
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{pickupDateStr}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-xs">{b.customer?.fullName || 'العميل'}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{b.customer?.phone || ''}</div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          ID: {customerId}
                        </div>
                      </td>

                      {/* Car */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-xs">
                          {b.car?.name ? (language === 'ar' ? b.car.name.ar : b.car.name.en) : 'سيارة فارهة'}
                        </div>
                        <div className="text-[10px] text-[#DFAB44] font-mono">
                          {b.car?.plateNumber || '—'}
                        </div>
                      </td>

                      {/* Duration & Total */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-stone-900 text-xs">
                          {totalAmt.toLocaleString()} {language === 'ar' ? 'ر.س' : 'SAR'}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {days} {language === 'ar' ? 'يوم' : 'days'}
                        </div>
                      </td>

{/* Internal Verification */}
                      <td className="py-3.5 px-4">
                        {hasTamm ? (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <div className="font-mono font-bold text-emerald-400 text-[11px]">
                                {b.tammAuthorizationNumber}
                              </div>
                              <div className="text-[9px] text-stone-400">موثق داخلياً لدى الشركة</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => issueTammAuthorization(b.bookingId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>{language === 'ar' ? 'توثيق داخلي' : 'Verify Internally'}</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                            isConfirmed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isCompleted
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>
                            {isConfirmed
                              ? language === 'ar' ? 'مؤكد ونشط' : 'Active'
                              : isCompleted
                              ? language === 'ar' ? 'مكتمل ومستلم' : 'Completed'
                              : language === 'ar' ? 'قيد المعالجة' : 'Processing'}
                          </span>
                        </span>
                      </td>

{/* Actions & Docs */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {b.status === 'pending_payment' || b.status === 'payment_unknown' ? (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.bookingId, 'confirmed')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 transition-colors hover:bg-emerald-500/20"
                              title={language === 'ar' ? 'تأكيد الحجز' : 'Confirm booking'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : b.status === 'confirmed' ? (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.bookingId, 'active')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 transition-colors hover:bg-emerald-500/20"
                              title={language === 'ar' ? 'بدء العقد وتسليم المركبة' : 'Start rental / handover'}
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                          ) : b.status === 'active' || b.status === 'return_pending' ? (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.bookingId, 'completed')}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 transition-colors hover:bg-blue-500/20"
                              title={language === 'ar' ? 'إغلاق العقد واستلام المركبة' : 'Complete rental / return'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : null}

                          {b.status !== 'completed' && b.status !== 'cancelled' && b.status !== 'no_show' && (
                            <button
                              type="button"
                              onClick={() => cancelBooking(b.bookingId)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 transition-colors hover:bg-red-500/20"
                              title={language === 'ar' ? 'إلغاء الحجز' : 'Cancel booking'}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {(b.status === 'cancelled' || b.status === 'no_show') && (
                            <button
                              type="button"
                              onClick={() => restoreBooking(b.bookingId)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 transition-colors hover:bg-emerald-500/20"
                              title={language === 'ar' ? 'استعادة الحجز إلى مؤكد' : 'Restore booking to confirmed'}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Invoice */}
                          <button
                            type="button"
                            onClick={() => onViewInvoice(b)}
                            className="p-1.5 rounded-lg bg-white text-[#DFAB44] hover:bg-white border border-stone-200 transition-colors"
                            title={language === 'ar' ? 'عرض وطباعة الفاتورة' : 'View & print invoice'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Hard delete */}
                          <button
                            type="button"
                            onClick={() => deleteBooking(b.bookingId)}
                            className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-500 hover:bg-rose-50 border border-stone-200 transition-colors"
                            title={language === 'ar' ? 'حذف الحجز نهائياً' : 'Delete booking permanently'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Digital Vehicle Inspection */}
                          <button
                            type="button"
                            onClick={() => onOpenInspection(b, 'pickup')}
                            className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 hover:bg-white border border-stone-200 transition-colors"
                            title={language === 'ar' ? 'فحص وتسليم المركبة' : 'Vehicle inspection & handover'}
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


