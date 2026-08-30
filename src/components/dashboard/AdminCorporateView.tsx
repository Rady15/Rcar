import React from 'react';
import {
  Award,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Car as CarIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCorporateView: React.FC = () => {
  const { language, corporateInquiries, updateCorporateStatus } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'طلبات وعقود أساطيل الشركات (B2B)' : 'Corporate Fleet Inquiries'}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar'
              ? 'إدارة طلبات التأجير طويل الأجل، عقود المشاريع، وخدمة الليموزين التنفيذي'
              : 'Manage long-term corporate leases, project fleets, and executive transport'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {corporateInquiries.map((inq) => {
          const isNew = inq.status === 'new';
          const isPropSent = inq.status === 'proposal_sent';

          return (
            <div
              key={inq.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#DFAB44] font-bold">{inq.id}</span>
                    <h3 className="font-black text-stone-900 text-base">{inq.companyName}</h3>
                    <div className="text-xs text-stone-400">المسؤول: {inq.contactPerson}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      isNew
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : isPropSent
                        ? 'bg-[#C9922C]/20 text-[#DFAB44] border border-[#C9922C]/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {inq.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">حجم الأسطول المطلوب:</span>
                    <span className="font-bold text-stone-900">{inq.fleetSize} سيارة</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">مدة العقد:</span>
                    <span className="font-bold text-stone-900">{inq.rentalDuration}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-stone-200">
                    <span className="text-stone-500 block text-[10px]">المدينة والتفاصيل:</span>
                    <span className="text-stone-300">{inq.city} • {inq.notes}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#DFAB44]" />
                    {inq.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {inq.email}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                {isNew && (
                  <button
                    type="button"
                    onClick={() => updateCorporateStatus(inq.id, 'proposal_sent')}
                    className="flex-1 py-2 px-3 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#C9922C]/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>إرسال عرض سعر رسمي B2B</span>
                  </button>
                )}

                {isPropSent && (
                  <button
                    type="button"
                    onClick={() => updateCorporateStatus(inq.id, 'contract_signed')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 text-[#1C1917] font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد العقد وتوقيعه</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

