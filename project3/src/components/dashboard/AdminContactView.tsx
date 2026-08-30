import React from 'react';
import { Mail, Trash2, Phone, MessageSquare, CheckCircle2, Clock, Archive } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminContactView: React.FC = () => {
  const { language, contactMessages, updateContactStatus, deleteContactMessage } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'رسائل التواصل والاستفسارات' : 'Contact Inbox'}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar' ? 'استقبال ومتابعة طلبات التواصل من نموذج اتصل بنا' : 'Inbound messages from the Contact form'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white text-[#DFAB44] text-xs font-bold border border-[#C9922C]/30">
          {contactMessages.length} {language === 'ar' ? 'رسالة' : 'messages'}
        </span>
      </div>

      {contactMessages.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-stone-200 text-center text-stone-500 text-sm">
          {language === 'ar' ? 'لا توجد رسائل حتى الآن.' : 'No messages yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {contactMessages.map((msg) => (
            <div key={msg.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-black text-stone-900 text-sm">{msg.name} <span className="font-mono text-xs text-[#DFAB44]">• {msg.phone}</span></div>
                  {msg.email && <div className="text-xs text-stone-400 font-mono">{msg.email}</div>}
                  <div className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white text-stone-300 text-[10px] font-bold uppercase">{msg.subject}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${msg.status==='new'?'bg-amber-500/20 text-amber-400 border-amber-500/30':msg.status==='read'?'bg-blue-500/20 text-blue-400 border-blue-500/30':msg.status==='replied'?'bg-emerald-500/20 text-emerald-400 border-emerald-500/30':'bg-white text-stone-300 border-stone-600'}`}>{msg.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {msg.status==='new' && (
                    <button onClick={() => updateContactStatus(msg.id,'read')} className="px-3 py-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 border border-stone-200 text-xs font-bold flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {language === 'ar' ? 'تمييز كمقروء' : 'Mark read'}</button>
                  )}
                  {msg.status!=='replied' && (
                    <button onClick={() => updateContactStatus(msg.id,'replied')} className="px-3 py-1.5 rounded-lg bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {language === 'ar' ? 'تم الرد' : 'Replied'}</button>
                  )}
                  <button onClick={() => updateContactStatus(msg.id,'archived')} className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-stone-900 border border-stone-200" title="أرشفة"><Archive className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteContactMessage(msg.id)} className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-400 border border-stone-200" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-200 leading-relaxed">
                {msg.message}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <a href={`tel:${msg.phone}`} className="px-2.5 py-1 rounded-lg bg-white text-[#DFAB44] font-mono text-xs border border-[#C9922C]/20 flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.phone}</a>
                {msg.email && <a href={`mailto:${msg.email}`} className="px-2.5 py-1 rounded-lg bg-white text-stone-300 font-mono text-xs border border-stone-200 flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


