import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Phone,
  HelpCircle,
  Car,
  MapPin,
  CalendarCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

export const LiveChatWidget: React.FC = () => {
  const { language, isChatOpen, toggleChat, navigateTo, openRoadsideModal } = useApp();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text:
        language === 'ar'
          ? 'مرحباً بك في مجموعة الرفقة لتأجير السيارات! 🚗 كيف يمكنني مساعدتك اليوم في حجز سيارتك أو الاستعلام عن فرع؟'
          : 'Welcome to Al-Rufqah Car Rental! 🚗 How can I assist you with your booking or branch inquiries today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        {
          label: language === 'ar' ? '🚗 استعراض الأسطول' : '🚗 Explore Fleet',
          action: () => navigateTo('fleet')
        },
        {
          label: language === 'ar' ? '📍 أقرب فرع لي' : '📍 Nearest Branch',
          action: () => navigateTo('branches')
        },
        {
          label: language === 'ar' ? '🎁 أحدث العروض' : '🎁 Latest Offers',
          action: () => navigateTo('offers')
        },
        {
          label: language === 'ar' ? '🛠️ مساعدة على الطريق' : '🛠️ Roadside Help',
          action: () => openRoadsideModal()
        }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let replyText = '';
      if (query.includes('سعر') || query.includes('اسعار') || query.includes('price') || query.includes('cost')) {
        replyText =
          language === 'ar'
            ? 'تبدأ أسعار سياراتنا الاقتصادية من 119 ريال/يوم (هيونداي أكسنت وتويوتا يارس 2025) شاملة التأمين وضريبة القيمة المضافة. يمكنك الاطلاع على كامل الأسطول والأسعار فوراً من صفحة أسطولنا.'
            : 'Economy cars start from 119 SAR/day (Hyundai Accent & Toyota Yaris 2025) including VAT and basic insurance. View all rates on our Fleet page!';
      } else if (query.includes('مطار') || query.includes('airport') || query.includes('رحلة')) {
        replyText =
          language === 'ar'
            ? 'فروعنا في مطارات الرياض (الصالة 1، 2، 3، 4، 5)، جدة، الدمام، المدينة، وأبها تعمل 24/7 مع توفر خدمة الاستلام الذاتي السريع بدون انتظار!'
            : 'Our airport branches in Riyadh, Jeddah, Dammam, Madinah, and Abha operate 24/7 with instant self-service key pickup!';
      } else if (query.includes('تأمين') || query.includes('insurance') || query.includes('شامل')) {
        replyText =
          language === 'ar'
            ? 'نوفر 3 باقات تأمين: التأمين الأساسي مجاناً، والتأمين الشامل (تحمل 500 ريال فقط)، وباقة الحماية الفائقة (صفر ريال تحمل).'
            : 'We offer 3 protection plans: Basic (included free), Comprehensive (500 SAR deductible), and Zero Liability Super Protection!';
      } else if (query.includes('خصم') || query.includes('عرض') || query.includes('كود') || query.includes('offer')) {
        replyText =
          language === 'ar'
            ? 'يمكنك استخدام كود الخصم WEEKEND20 للحصول على 20% خصم في عطلة نهاية الأسبوع، أو AIRPORT15 لخصم 15% على حجوزات المطارات.'
            : 'You can use promo code WEEKEND20 for 20% off on weekend rentals, or AIRPORT15 for 15% off airport reservations!';
      } else {
        replyText =
          language === 'ar'
            ? 'شكراً لتواصلك مع مجموعة الرفقة! يمكنك إتمام حجزك مباشرة عبر الموقع أو الاتصال برقمنا الموحد 9200 78372 لأي استفسار عاجل.'
            : 'Thank you for reaching out to Al-Rufqah! You can book directly online or call our unified toll-free support at 9200 78372.';
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="group flex items-center gap-2 gold-gradient-bg hover:brightness-105 text-[#1C1917] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-[#C9922C]/25 hover:scale-105 active:scale-95 transition-all border border-[#E9C682]"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 fill-[#1C1917]" />
            <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#C9922C]"></span>
          </div>
          <span className="hidden sm:inline font-black text-xs">
            {language === 'ar' ? 'المساعد الذكي 24/7' : '24/7 Smart Assistant'}
          </span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isChatOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-[#FAF9F5] rounded-3xl shadow-2xl border border-[#EDE4D3] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between border-b border-[#3E3832]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-[#1C1917] font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">
                  {language === 'ar' ? 'مساعد الرفقة الفوري' : 'Al-Rufqah Live Assistant'}
                </h4>
                <span className="flex items-center gap-1 text-[10px] text-[#DFAB44] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'ar' ? 'متصل الآن للإجابة' : 'Online & Ready'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleChat}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBF9F5] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1C1917] text-[#FAF9F5] border border-[#3E3832] rounded-br-xs'
                      : 'bg-white text-stone-800 border border-[#EDE4D3] shadow-xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{m.timestamp}</span>

                {/* Quick actions if any */}
                {m.quickActions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          qa.action();
                          toggleChat();
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#FAF3E8] text-stone-700 hover:text-[#A07018] border border-[#EDE4D3] rounded-lg text-[11px] font-semibold transition-colors shadow-2xs"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EDE4D3] flex items-center gap-2">
            <input
              type="text"
              placeholder={language === 'ar' ? 'اكتب استفسارك هنا...' : 'Type your question...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
            />
            <button
              type="submit"
              className="p-2 gold-gradient-bg hover:brightness-105 text-[#1C1917] rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 end-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all animate-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : toast.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-800'
              : 'bg-slate-900 text-slate-100 border-slate-800'
          }`}
        >
          <div className="flex-1">
            <h5 className="font-bold text-xs text-white">{toast.title}</h5>
            <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
