import React from 'react';
import {
  Activity,
  ShieldCheck,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAuditLogsView: React.FC = () => {
  const { language, auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'سجل الرقابة والتدقيق الأمني (Audit Trail)' : 'Security Audit Trail'}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar' ? 'توثيق غير قابل للتعديل لكافة الإجراءات الإدارية وإصدار تفويضات تم' : 'Immutable audit log of all system actions'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
        <div className="divide-y divide-[#2C2621]">
          {auditLogs.length === 0 ? (
            <div className="p-10 text-center text-stone-400 text-sm">{language === 'ar' ? 'لا توجد سجلات تدقيق على الخادم.' : 'No audit records found on the server.'}</div>
          ) : auditLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-stone-50 text-[#DFAB44] border border-stone-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs">{log.action}</div>
                  <div className="text-[10px] text-stone-500 mt-1">{log.details}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    بواسطة: <span className="text-[#DFAB44] font-medium">{log.actor}</span> • القسم: <span className="font-mono">{log.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-end">
                <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Server persisted record</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


