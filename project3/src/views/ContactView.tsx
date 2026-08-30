import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldAlert,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SectionReveal } from '../components/SectionReveal';

export const ContactView: React.FC = () => {
  const { language, t, openRoadsideModal, addContactMessage } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContactMessage({ name, phone, email: email || undefined, subject, message });
      setSubmitted(true);
    } catch (err: any) {
      // toast handled in context
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'خدمة العملاء والتواصل' : 'Customer Support & Contact'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">{t.navContact}</h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'نحن هنا لخدمتك على مدار الساعة في جميع مناطق المملكة. تواصل معنا عبر الرقم الموحد، الواتساب، أو بزيارة أحد فروعنا.'
              : 'We are here to assist you 24/7 across all regions of Saudi Arabia. Reach us via our unified toll-free line, WhatsApp, or at any branch.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* 24/7 SOS Emergency Alert Bar */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#1C1917] via-[#2A2522] to-[#1C1917] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#C9922C]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9922C]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 text-center sm:text-start relative z-10">
          <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 text-[#1C1917] border border-[#E9C682]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#DFAB44]">{language === 'ar' ? 'طوارئ الرفقة والمساعدة على الطريق 24/7' : '24/7 Roadside Rescue Emergency'}</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              {language === 'ar' ? 'خدمة مجانية فورية لنقل الأعطال، شحن البطارية وتغيير الإطارات في كافة طرق المملكة.' : 'Instant free dispatch for flat tyres, battery jumps, towing and key lockouts.'}
            </p>
          </div>
        </div>

        <button
          onClick={openRoadsideModal}
          className="px-6 py-3 rounded-2xl gold-gradient-bg text-[#1C1917] hover:brightness-105 font-black text-xs sm:text-sm shadow-lg shrink-0 transition-all active:scale-95 btn-hover btn-pop border border-[#E9C682] relative z-10"
        >
          {language === 'ar' ? 'طلب مساعدة طارئة الآن' : 'Request Rescue SOS'}
        </button>
      </div>
      </SectionReveal>

      {/* Main Grid: Info cards & Contact Form */}
      <SectionReveal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold border border-[#ECD9BA]">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'الرقم الموحد (مجاني)' : 'Unified Toll-Free'}</h4>
            <a href="tel:920078372" className="text-base font-black text-[#A07018] block hover:underline">
              9200 78372 (RUF-KSA)
            </a>
            <p className="text-[11px] text-stone-500">{language === 'ar' ? 'متاح 24 ساعة طوال أيام الأسبوع' : 'Available 24/7'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'خدمة عملاء واتساب' : 'WhatsApp Business'}</h4>
            <a
              href="https://wa.me/966920078372"
              target="_blank"
              rel="noreferrer"
              className="text-base font-black text-emerald-600 block hover:underline"
            >
              +966 9200 78372
            </a>
            <p className="text-[11px] text-stone-500">{language === 'ar' ? 'استجابة سريعة وتأكيد الحجوزات' : 'Instant chat & booking confirmations'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#A07018] flex items-center justify-center font-bold border border-[#ECD9BA]">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</h4>
            <a href="mailto:care@alrufqah.sa" className="text-sm font-bold text-stone-800 block hover:underline">
              care@alrufqah.sa
            </a>
            <p className="text-[11px] text-stone-500">{language === 'ar' ? 'للاستفسارات والشكاوى ومبيعات الشركات' : 'General inquiries & corporate leasing'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EDE4D3] shadow-xs card-hover space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold border border-stone-200">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">{language === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}</h4>
            <p className="text-xs text-stone-600">
              {language === 'ar'
                ? 'طريق الملك فهد، حي الصحافة، برج الرفقة للأعمال، الرياض، المملكة العربية السعودية'
                : 'King Fahd Road, Al-Sahafa Dist., Al-Rufqah Tower, Riyadh, Saudi Arabia'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EDE4D3] p-8 sm:p-10 shadow-sm card-hover">
          <h3 className="text-2xl font-black text-stone-900 mb-2">
            {language === 'ar' ? 'أرسل لنا رسالة أو استفسار' : 'Send Us a Message'}
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            {language === 'ar'
              ? 'يسعدنا استقبال آرائكم واستفساراتكم، وسيقوم ممثل خدمة العملاء بالتواصل معكم في أقرب وقت.'
              : 'We value your inquiries and feedback. Our support team will get in touch shortly.'}
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'ar' ? 'أحمد الشمري' : 'Your name'}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'موضوع الرسالة' : 'Subject'}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                >
                  <option value="general">{language === 'ar' ? 'استفسار عام عن التأجير' : 'General Rental Inquiry'}</option>
                  <option value="booking">{language === 'ar' ? 'تعديل أو متابعة حجز قائم' : 'Existing Booking Assistance'}</option>
                  <option value="corporate">{language === 'ar' ? 'عقود الشركات والتأجير طويل الأجل' : 'Corporate Fleet Inquiry'}</option>
                  <option value="feedback">{language === 'ar' ? 'ملاحظات واقتراحات وشكاوى' : 'Feedback & Complaints'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'نص الرسالة أو الاستفسار' : 'Your Message'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب تفاصيل استفسارك هنا...' : 'Write details here...'}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] font-black text-xs sm:text-sm shadow-md shadow-[#C9922C]/20 transition-all btn-hover btn-pop flex items-center justify-center gap-2 border border-[#E9C682]"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال الرسالة' : 'Submit Message'}</span>
              </button>
            </form>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-black text-xl text-stone-900">
                {language === 'ar' ? 'تم استلام رسالتك بنجاح' : 'Message Sent Successfully'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {language === 'ar'
                  ? 'شكراً لتواصلك معنا. سيقوم فريق خدمة عملاء الرفقة بالرد عليك خلال ساعات العمل.'
                  : 'Thank you! Our support team will get back to you shortly.'}
              </p>
            </div>
          )}
        </div>
      </div>
      </SectionReveal>
    </div>
  );
};
