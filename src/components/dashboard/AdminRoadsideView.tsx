import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Send,
  ShieldAlert,
  Car as CarIcon,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminRoadsideView: React.FC = () => {
  const { language, roadsideTickets, updateRoadsideTicketStatus, openRoadsideModal } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{language === 'ar' ? 'غرفة عمليات طوارئ الطريق 24/7 (Roadside SOS)' : '24/7 Roadside SOS Dispatch'}</span>
          </h2>
          <p className="text-xs text-rose-200/80 mt-1">
            {language === 'ar'
              ? 'توجيه فوري لسطحات الرفع، فرق شحن البطاريات، إصلاح الإطارات وتزويد الوقود.'
              : 'Direct dispatch for towing trucks, battery jump-starts, flat tires, and fuel delivery.'}
          </p>
        </div>

        <button
          type="button"
          onClick={openRoadsideModal}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-stone-900 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنشاء بلاغ طوارئ جديد' : 'New SOS Ticket'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roadsideTickets.map((ticket) => {
          const isPending = ticket.status === 'pending';
          const isDispatched = ticket.status === 'dispatched';
          const isResolved = ticket.status === 'resolved';

          return (
            <div
              key={ticket.id}
              className={`p-5 rounded-2xl bg-white border shadow-xl flex flex-col justify-between space-y-4 ${
                isPending
                  ? 'border-rose-500/50 ring-1 ring-rose-500/30'
                  : isDispatched
                  ? 'border-amber-500/40'
                  : 'border-stone-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#DFAB44]">{ticket.id}</span>
                    <h3 className="font-black text-stone-900 text-sm">{ticket.customerName}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isPending
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : isDispatched
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isPending
                      ? language === 'ar' ? 'قيد الانتظار' : 'Pending'
                      : isDispatched
                      ? language === 'ar' ? 'تم توجيه الفني' : 'Dispatched'
                      : language === 'ar' ? 'تم الحل والإغلاق' : 'Resolved'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <CarIcon className="w-3.5 h-3.5 text-[#DFAB44]" />
                    <span>{ticket.carName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono">{ticket.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-stone-200">{ticket.locationDescription}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-[11px] text-stone-400">
                    <span className="text-[#DFAB44] font-bold">نوع العطل: </span>
                    {ticket.issueType === 'towing'
                      ? 'سحب ونقل سطحة'
                      : ticket.issueType === 'battery'
                      ? 'شحن/تبديل بطارية'
                      : ticket.issueType === 'flat_tire'
                      ? 'بنشر وتبديل إطار'
                      : 'تزويد وقود طارئ'}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                {isPending && (
                  <button
                    type="button"
                    onClick={() => updateRoadsideTicketStatus(ticket.id, 'dispatched', 'كابتن فهد - سطحة هيدروليك')}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'توجيه فني الميدان' : 'Dispatch Tech'}</span>
                  </button>
                )}

                {isDispatched && (
                  <button
                    type="button"
                    onClick={() => updateRoadsideTicketStatus(ticket.id, 'resolved')}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إغلاق البلاغ بنجاح' : 'Mark Resolved'}</span>
                  </button>
                )}

                {isResolved && (
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تمت معالجة البلاغ</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

