import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionReveal } from '../components/SectionReveal';
import {
  Building2,
  Briefcase,
  ShieldCheck,
  Wrench,
  Receipt,
  FileCheck,
  PhoneCall,
  CheckCircle2,
  Users,
  Car,
  TrendingDown,
  Send
} from 'lucide-react';

export const CorporateView: React.FC = () => {
  const { language, t, showToast, addCorporateInquiry } = useApp();
  const [companyName, setCompanyName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fleetSize, setFleetSize] = useState('5-15');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCorporateInquiry({ companyName, contactPerson, phone, email, fleetSize, rentalDuration: '12 months', city: '', notes: `CR: ${crNumber}` });
      setSubmitted(true);
    } catch (err: any) {
      showToast('error', language === 'ar' ? 'تعذر إرسال الطلب' : 'Submission failed', err.message);
      return;
    }
    showToast(
      'success',
      language === 'ar' ? 'تم استلام طلب عروض الأسعار للشركات' : 'Corporate RFP Submitted',
      language === 'ar'
        ? 'سيتواصل معك مدير حسابات الشركات خلال 4 ساعات عمل لتقديم العرض المخصص.'
        : 'Our Corporate Account Manager will contact you within 4 business hours.'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-black text-[#DFAB44] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'حلول قطاع الأعمال والشركات' : 'B2B & Corporate Fleet Solutions'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {language === 'ar' ? 'إدارة أسطول الشركات وعقود التأجير التشغيلي' : 'Enterprise Fleet Leasing & Management'}
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
            {language === 'ar'
              ? 'حلول تأجير تشغيلي وتمويلي مصممة للشركات والمؤسسات والجهات الحكومية في المملكة مع صيانة شاملة، سيارات بديلة فورية، وفواتير إيجار معتمدة وموثقة داخلياً.'
              : 'Flexible corporate leasing solutions for businesses, institutions, and government entities with full periodic maintenance, immediate replacement vehicles, and verified rental invoicing.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Value Pillars Grid */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#EDE4D3] shadow-xs card-hover space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold border border-[#ECD9BA]">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-stone-900">
            {language === 'ar' ? 'توفير التكاليف الرأسمالية (CapEx)' : 'Zero Capital Outlay (CapEx)'}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'ar'
              ? 'حوّل نفقاتك الرأسمالية لشراء السيارات إلى مصاريف تشغيلية خاضعة للخصم الضريبي بدون التأثير على السيولة المالية للمنشأة.'
              : 'Convert heavy capital expenditures into tax-deductible operating expenses without straining corporate cash flow.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#EDE4D3] shadow-xs card-hover space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold border border-[#ECD9BA]">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-stone-900">
            {language === 'ar' ? 'صيانة شاملة وسيارة بديلة فورية' : 'Full Maintenance & Replacement'}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'ar'
              ? 'صيانة دورية مجانية في شبكة ورشنا ومراكزنا المعتمدة، مع توفير مركبة بديلة في غضون ساعتين عند أي عطل أو حادث.'
              : 'Complimentary scheduled maintenance across our certified centers, plus instant replacement within 2 hours in case of repairs.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#EDE4D3] shadow-xs card-hover space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center font-bold border border-[#ECD9BA]">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-stone-900">
            {language === 'ar' ? 'لوحة تحكم وفواتير إلكترونية' : 'Corporate Portal & Invoicing'}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'ar'
              ? 'منصة رقمية موحدة لإدارة عقود الإيجار وتوثيقها داخلياً، متابعة الاستخدام، واستلام الفواتير مباشرة من النظام.'
              : 'Unified corporate portal to manage verified rental contracts, track usage, and receive invoices directly from the platform.'}
          </p>
        </div>
      </div>
      </SectionReveal>

      {/* Corporate RFP Quotation Form */}
      <SectionReveal>
      <div className="bg-white rounded-3xl border border-[#EDE4D3] shadow-lg p-8 sm:p-12 card-hover">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-black text-[#A07018] uppercase tracking-wider">
            {language === 'ar' ? 'طلب عرض سعر مخصص' : 'Request Corporate Quote'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'ar' ? 'انضم إلى أكثر من 850 جهة تعتمد على الرفقة' : 'Partner With Al-Rufqah Group'}
          </h2>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'أدخل بيانات منشأتك وسيقوم فريق استشارات الشركات بالتواصل معك خلال ساعات لإعداد العرض الأنسب لاحتياجات أسطولك.'
              : 'Enter your company details and our corporate leasing team will respond with a tailored proposal.'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'اسم الشركة / المنشأة' : 'Company Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'شركة الرفقة للتجارة والمقاولات' : 'Company Name LLC'}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'رقم السجل التجاري (CR)' : 'Commercial Registration No.'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="1010XXXXXX"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'اسم مسؤول التواصل' : 'Contact Person'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'عبدالله القحطاني' : 'Contact Person'}
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'رقم الجوال' : 'Mobile Phone'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'البريد الإلكتروني للعمل' : 'Corporate Email'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.sa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'حجم الأسطول التقريبي المطلوب' : 'Approximate Fleet Size'}
                </label>
                <select
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                >
                  <option value="1-4">{language === 'ar' ? '1 إلى 4 سيارات' : '1 - 4 Vehicles'}</option>
                  <option value="5-15">{language === 'ar' ? '5 إلى 15 سيارة' : '5 - 15 Vehicles'}</option>
                  <option value="16-50">{language === 'ar' ? '16 إلى 50 سيارة' : '16 - 50 Vehicles'}</option>
                  <option value="50+">{language === 'ar' ? 'أكثر من 50 سيارة (أسطول ضخم)' : '50+ Enterprise Fleet'}</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] font-black text-sm shadow-md shadow-[#C9922C]/20 transition-all btn-hover btn-pop flex items-center justify-center gap-2 border border-[#E9C682]"
              >
                <Send className="w-4 h-4 fill-[#1C1917]" />
                <span>{language === 'ar' ? 'إرسال طلب عرض الأسعار' : 'Submit Corporate RFP'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#C9922C] flex items-center justify-center mx-auto border border-[#ECD9BA]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-xl text-stone-900">
              {language === 'ar' ? 'شكراً لتواصلك معنا' : 'Thank You!'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ar'
                ? `تم تسجيل طلب منشأتكم بنجاح. سيقوم المستشار المسؤول بالتواصل مع ${contactPerson} عبر الهاتف أو البريد الموضح.`
                : `Your request has been received. Our account manager will contact ${contactPerson} shortly.`}
            </p>
          </div>
        )}
      </div>
      </SectionReveal>
    </div>
  );
};
