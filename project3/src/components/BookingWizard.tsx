import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiPost } from '../lib/api';
import currencyImg from '../assets/currency.png';
import { BookingDetails, ProtectionPlan } from '../types';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Minus,
  Calendar,
  MapPin,
  Clock,
  Car as CarIcon,
  CreditCard,
  Check,
  Printer,
  Share2,
  FileText,
  User,
  Phone,
  Mail,
  Zap,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Tag,
  AlertCircle
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    isAuthenticated,
    isBookingWizardOpen,
    bookingCar,
    closeBookingWizard,
    searchCriteria,
    saveBooking,
    appliedPromoCode,
    applyPromoCode,
    navigateTo,
    showToast,
    branches,
    protectionPlans,
    addonOptions
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedPlan, setSelectedPlan] = useState<ProtectionPlan>(protectionPlans[1] || protectionPlans[0]);
  const [selectedAddons, setSelectedAddons] = useState<{ [addonId: string]: number }>({});
  const [paymentMethod, setPaymentMethod] = useState<
    'mada' | 'visa_mastercard' | 'pay_on_arrival'
  >('pay_on_arrival');

  // Customer Form State
  const [customer, setCustomer] = useState({
    fullName: currentUser?.fullName || '',
    idType: currentUser?.idType || ('national_id' as const),
    idNumber: currentUser?.idNumber || '',
    birthDate: (currentUser as any)?.birthDate || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    driverLicenseNumber: currentUser?.licenseNumber || '',
    nationality: currentUser?.nationality || (language === 'ar' ? 'سعودي' : 'Saudi')
  });

  // Prefill the driver form from the authenticated customer account.
  // This also handles the case where auth/me finishes after the wizard was opened.
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    setCustomer(prev => ({
      ...prev,
      fullName: currentUser.fullName || prev.fullName,
      idType: currentUser.idType || prev.idType,
      idNumber: currentUser.idNumber || prev.idNumber,
      birthDate: (currentUser as any).birthDate || prev.birthDate,
      phone: currentUser.phone || prev.phone,
      email: currentUser.email || prev.email,
      driverLicenseNumber: currentUser.licenseNumber || prev.driverLicenseNumber,
      nationality: currentUser.nationality || prev.nationality
    }));
  }, [isAuthenticated, currentUser]);

  const [wizardPromo, setWizardPromo] = useState(appliedPromoCode || '');
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingDetails | null>(null);

  if (!isBookingWizardOpen || !bookingCar) return null;

  // Calculate rental days
  const pickupD = new Date(searchCriteria.pickupDate);
  const returnD = new Date(searchCriteria.returnDate);
  const diffTime = Math.abs(returnD.getTime() - pickupD.getTime());
  const numberOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Lookup branches
  const pickupBranch =
    branches.find((b) => b.id === searchCriteria.pickupBranchId) || branches[0];
  const returnBranch = searchCriteria.returnToDifferentLocation
    ? branches.find((b) => b.id === searchCriteria.returnBranchId) || branches[0]
    : pickupBranch;

  // Financial calculations
  const baseRentalAmount = bookingCar.dailyPrice * numberOfDays;
  const protectionAmount = selectedPlan.pricePerDay * numberOfDays;
  
  const addonsAmount = Object.entries(selectedAddons).reduce((acc, [id, qty]) => {
    const opt = addonOptions.find((o) => o.id === id);
    const quantity = Number(qty) || 0;
    return acc + (opt ? opt.pricePerDay * quantity * numberOfDays : 0);
  }, 0);

  const intercityFee =
    searchCriteria.returnToDifferentLocation &&
    pickupBranch.city.en !== returnBranch.city.en
      ? 150
      : 0;

  // Discount calculation
  let discountRate = 0;
  if (['WEEKEND20'].includes(wizardPromo.toUpperCase())) discountRate = 0.20;
  else if (['AIRPORT15'].includes(wizardPromo.toUpperCase())) discountRate = 0.15;
  else if (['EARLYBIRD'].includes(wizardPromo.toUpperCase())) discountRate = 0.10;
  else if (['MONTHLY35'].includes(wizardPromo.toUpperCase()) && numberOfDays >= 25) discountRate = 0.35;
  else if (bookingCar.discountPercentage) discountRate = bookingCar.discountPercentage / 100;

  const discountAmount = Math.round(baseRentalAmount * discountRate);
  const subtotalBeforeVat = baseRentalAmount + protectionAmount + addonsAmount + intercityFee - discountAmount;
  const vatAmount = +(subtotalBeforeVat * 0.15).toFixed(2);
  const totalAmount = +(subtotalBeforeVat + vatAmount).toFixed(2);

  const handleAddonToggle = (addonId: string, delta: number) => {
    setSelectedAddons((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      const opt = addonOptions.find((o) => o.id === addonId);
      const max = opt?.maxQuantity || 1;
      if (next > max) return prev;
      if (next === 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: next };
    });
  };

  const handleApplyWizardPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardPromo.trim()) {
      applyPromoCode(wizardPromo);
    }
  };

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const idempotencyKey = crypto.randomUUID();
    try {
      const quote = await apiPost<any>('/api/bookings/quote', {
        carId: bookingCar.id,
        pickupDate: searchCriteria.pickupDate,
        pickupTime: searchCriteria.pickupTime,
        returnDate: searchCriteria.returnDate,
        returnTime: searchCriteria.returnTime,
        pickupBranchId: searchCriteria.pickupBranchId,
        returnBranchId: searchCriteria.returnBranchId,
        returnToDifferentLocation: searchCriteria.returnToDifferentLocation,
        protectionPlanId: selectedPlan.id,
        selectedAddons,
        promoCode: wizardPromo
      });
      if (!quote.available) {
        showToast('error', language === 'ar' ? 'السيارة لم تعد متاحة' : 'Vehicle unavailable', language === 'ar' ? 'اختر سيارة أو موعدًا آخر.' : 'Please choose another vehicle or time.');
        return;
      }
      const newBookingId = `RUF-${Math.floor(10000 + Math.random() * 90000)}`;
      const newBooking: BookingDetails = {
        bookingId: newBookingId,
        createdAt: new Date().toISOString(),
        car: bookingCar,
        searchCriteria: { ...searchCriteria, promoCode: wizardPromo },
        pickupBranch,
        returnBranch,
        numberOfDays: quote.numberOfDays,
        protectionPlan: selectedPlan,
        selectedAddons,
        customer,
        payment: {
          method: paymentMethod,
          baseAmount: quote.baseAmount,
          protectionAmount: quote.protectionAmount,
          addonsAmount: quote.addonsAmount,
          intercityFee: quote.intercityFee,
          vatAmount: quote.vatAmount,
          discountAmount: quote.discountAmount,
          totalAmount: quote.totalAmount,
          isPaid: false
        },
        status: 'confirmed'
      };
      const saved = await apiPost<BookingDetails>('/api/bookings', newBooking, { 'Idempotency-Key': idempotencyKey });
      const intent = (saved as any).paymentIntent;
      if (paymentMethod !== 'pay_on_arrival') {
        const checkoutUrl = intent?.data?.checkoutUrl || intent?.data?.url || intent?.data?.paymentUrl;
        if (!checkoutUrl) throw new Error(language === 'ar' ? 'مزود الدفع لم يُرجع رابط دفع صالحًا.' : 'The payment provider did not return a valid checkout URL.');
        window.location.assign(checkoutUrl);
        return;
      }
      setConfirmedBookingData(saved);
      setStep(6);
    } catch (err: any) {
      showToast('error', language === 'ar' ? 'تعذر تأكيد الحجز' : 'Booking failed', err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Header Bar */}
        <div className="bg-[#1C1917] text-white px-6 py-4 flex items-center justify-between border-b border-[#3E3832] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-[#1C1917] font-black text-sm border border-[#E9C682]">
              {step < 6 ? `${step}/5` : '✓'}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {step === 1 && (language === 'ar' ? 'ملخص الرحلة والمركبة' : 'Trip & Vehicle Summary')}
                {step === 2 && (language === 'ar' ? 'باقات التأمين والحماية' : 'Protection & Insurance')}
                {step === 3 && (language === 'ar' ? 'الخدمات والإضافات' : 'Extras & Add-ons')}
                {step === 4 && (language === 'ar' ? 'بيانات السائق والتحقق' : 'Driver Details & Verification')}
                {step === 5 && (language === 'ar' ? 'طريقة الدفع والتأكيد' : 'Payment & Confirmation')}
                {step === 6 && (language === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Booking Confirmed!')}
              </h3>
              <p className="text-xs text-[#DFAB44]">
                {bookingCar.name[language]} • {numberOfDays} {language === 'ar' ? 'أيام' : 'Days'}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingWizard}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SUMMARY */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Selected Car preview card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EDE4D3] flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={bookingCar.image}
                  alt={bookingCar.name[language]}
                  className="w-40 h-28 object-cover rounded-xl shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-1 text-center sm:text-start">
                  <span className="text-xs font-bold text-[#A47018] uppercase">
                    {bookingCar.category}
                  </span>
                  <h4 className="text-xl font-black text-stone-900">
                    {bookingCar.name[language]}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {bookingCar.engineCapacity} • {bookingCar.seats} {t.seats} • {bookingCar.includedMileagePerDay} {t.kmPerDay}
                  </p>
                  <div className="pt-2 flex items-baseline gap-1 justify-center sm:justify-start">
                    <span className="text-2xl font-black text-stone-900">
                      {bookingCar.dailyPrice}
                    </span>
                    <span className="text-xs font-bold text-[#A47018] inline-flex items-center gap-1"><img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'يوم' : 'Day'}</span>
                  </div>
                </div>
              </div>

              {/* Booking schedule details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF3E8] border border-[#ECD9BA] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#61420B]">
                    <MapPin className="w-4 h-4 text-[#C9922C]" />
                    <span>{t.pickupLocation}</span>
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{pickupBranch.name[language]}</div>
                  <div className="text-xs text-stone-600 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {searchCriteria.pickupDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {searchCriteria.pickupTime}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE4D3] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <MapPin className="w-4 h-4 text-[#C9922C]" />
                    <span>{t.returnLocation}</span>
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{returnBranch.name[language]}</div>
                  <div className="text-xs text-stone-600 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {searchCriteria.returnDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {searchCriteria.returnTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROTECTION PLANS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                {language === 'ar'
                  ? 'اختر باقة الحماية المناسبة لرحلتك لقيادة آمنة وراحة بال مطلقة:'
                  : 'Choose your desired protection plan for complete peace of mind:'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {protectionPlans.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#C9922C] bg-[#FAF3E8] shadow-md ring-2 ring-[#C9922C]/20'
                          : 'border-[#EDE4D3] bg-white hover:border-[#DFAB44]'
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-3 start-1/2 -translate-x-1/2 gold-gradient-bg text-[#1C1917] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase border border-[#E9C682]">
                          {language === 'ar' ? 'الأكثر اختياراً' : 'Recommended'}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-sm text-stone-900">
                            {plan.name[language]}
                          </h4>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#1C1917] border-[#1C1917] text-[#DFAB44]'
                                : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-xs text-stone-500 leading-relaxed mb-4">
                          {plan.description[language]}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          {plan.features[language].map((f, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs text-stone-700 font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9922C] shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#EDE4D3] flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-stone-400 font-medium">
                            {language === 'ar' ? 'نسبة التحمل:' : 'Excess:'}
                          </span>
                          <span className="text-xs font-bold text-stone-800 ms-1 inline-flex items-center gap-1">
                            {plan.deductible} <img src={currencyImg} alt="ريال" className="h-3 w-auto" />
                          </span>
                        </div>
                        <div className="font-black text-base text-stone-900">
                          {plan.pricePerDay === 0 ? (
                            <span className="text-emerald-700">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1">{plan.pricePerDay} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'يوم' : 'Day'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXTRAS & ADDONS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 mb-2">
                {language === 'ar'
                  ? 'أضف المزيد من الراحة والحرية إلى تجربة قيادتك:'
                  : 'Enhance your trip with customized extras and accessories:'}
              </div>

              <div className="space-y-3">
                {addonOptions.map((addon) => {
                  const qty = selectedAddons[addon.id] || 0;
                  return (
                    <div
                      key={addon.id}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE4D3] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#EDE4D3] flex items-center justify-center text-[#A47018] font-bold">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">
                            {addon.name[language]}
                          </h4>
                          <p className="text-xs text-stone-500">{addon.description[language]}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-end">
                          <span className="font-black text-sm text-stone-900 inline-flex items-center gap-1">
                            {addon.pricePerDay} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /> / {language === 'ar' ? 'يوم' : 'Day'}
                          </span>
                          <span className="block text-[10px] text-stone-400 inline-flex items-center gap-1">
                            {addon.pricePerDay * numberOfDays} <img src={currencyImg} alt="ريال" className="h-2.5 w-auto" /> / {numberOfDays} {language === 'ar' ? 'أيام' : 'days'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#EDE4D3] p-1">
                          <button
                            type="button"
                            onClick={() => handleAddonToggle(addon.id, -1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-black text-stone-800">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddonToggle(addon.id, 1)}
                            className="w-7 h-7 rounded-lg gold-gradient-bg hover:brightness-105 text-[#1C1917] flex items-center justify-center transition-colors border border-[#E9C682]"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DRIVER VERIFICATION */}
          {step === 4 && (
            <form id="driverForm" onSubmit={(e) => { e.preventDefault(); setStep(5); }} className="space-y-4">
              {isAuthenticated && currentUser && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs text-indigo-900 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{language === 'ar' ? 'تم تعبئة بياناتك المحفوظة من حسابك تلقائيًا. يمكنك مراجعتها وتعديلها قبل التأكيد.' : 'Your saved account details have been filled automatically. Review or edit them before confirming.'}</span>
                  </div>
                  <span className="hidden sm:inline-flex rounded-full bg-white px-2.5 py-1 font-bold text-[10px] text-indigo-700 border border-indigo-100">{currentUser.email}</span>
                </div>
              )}

              <div className="bg-[#FAF3E8] border border-[#ECD9BA] rounded-xl p-3 text-xs text-[#61420B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#C9922C] shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'يتم إصدار عقد الإيجار الرقمي وتوثيقه داخلياً لدى الشركة مباشرة بالبيانات المدخلة أدناه.'
                    : 'The digital rental contract will be issued and verified internally by the company directly with the information entered below.'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'الاسم الكامل الثلاثي (كما بالهوية)' : 'Full Legal Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'مثال: محمد بن خالد العتيبي' : 'e.g. Mohammed Al-Otaibi'}
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'نوع وثيقة الإثبات' : 'ID Type'}
                  </label>
                  <select
                    value={customer.idType}
                    onChange={(e) => setCustomer({ ...customer, idType: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  >
                    <option value="national_id">{language === 'ar' ? 'هوية وطنية سعودية' : 'Saudi National ID'}</option>
                    <option value="iqama">{language === 'ar' ? 'إقامة نظامية' : 'Resident Iqama'}</option>
                    <option value="gcc_id">{language === 'ar' ? 'هوية مواطني دول مجلس التعاون' : 'GCC National ID'}</option>
                    <option value="passport">{language === 'ar' ? 'جواز سفر مع تأشيرة دخول' : 'Passport & Visa'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'رقم الهوية / الإقامة / الجواز' : 'ID / Iqama / Passport Number'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10XXXXXXXX"
                    value={customer.idNumber}
                    onChange={(e) => setCustomer({ ...customer, idNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'رقم الجوال للتواصل وتلقي الرمز' : 'Mobile Number for SMS'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'ar' ? 'رقم رخصة القيادة' : 'Driver License No.'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10XXXXXXXX"
                    value={customer.driverLicenseNumber}
                    onChange={(e) => setCustomer({ ...customer, driverLicenseNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EDE4D3] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#C9922C]/30 focus:border-[#C9922C]"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 5: PAYMENT & BREAKDOWN */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ar' ? 'اختر طريقة الدفع المفضلة' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'visa_mastercard', name: 'Visa / MasterCard', desc: language === 'ar' ? 'دفع آمن عبر الإنترنت' : 'Secure online payment' },
                    { id: 'mada', name: 'mada مدى', desc: language === 'ar' ? 'بطاقة الدفع السعودية' : 'Saudi Payment Card' },
                    { id: 'pay_on_arrival', name: language === 'ar' ? 'الدفع في الفرع' : 'Pay at Branch', desc: language === 'ar' ? 'عند استلام السيارة' : 'Upon vehicle pickup' }
                  ].map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        paymentMethod === pm.id
                          ? 'border-[#C9922C] bg-[#FAF3E8] shadow-xs'
                          : 'border-[#EDE4D3] bg-white hover:border-[#DFAB44]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-stone-900">{pm.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === pm.id
                              ? 'bg-[#1C1917] border-[#1C1917] text-[#DFAB44]'
                              : 'border-stone-300'
                          }`}
                        >
                          {paymentMethod === pm.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-500">{pm.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code box in step 5 */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4D3]">
                <form onSubmit={handleApplyWizardPromo} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t.promoCodePlaceholder}
                      value={wizardPromo}
                      onChange={(e) => setWizardPromo(e.target.value)}
                      className="w-full bg-white border border-[#EDE4D3] rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute top-2.5 end-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1C1917] hover:bg-stone-800 text-[#DFAB44] rounded-xl text-xs font-bold border border-[#3E3832]"
                  >
                    {language === 'ar' ? 'تطبيق الكود' : 'Apply'}
                  </button>
                </form>
              </div>

              {/* Price Breakdown Bill */}
              <div className="bg-[#1C1917] text-white p-5 rounded-2xl space-y-3 border border-[#3E3832]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#DFAB44] border-b border-[#3E3832] pb-2">
                  {language === 'ar' ? 'تفاصيل التكلفة النهائية' : 'Price Summary'}
                </h4>

                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>
                      {bookingCar.name[language]} ({numberOfDays} {language === 'ar' ? 'أيام' : 'days'})
                    </span>
                    <span className="font-bold text-white inline-flex items-center gap-1">{baseRentalAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                  </div>

                  {protectionAmount > 0 && (
                    <div className="flex justify-between">
                      <span>{selectedPlan.name[language]}</span>
                      <span className="font-bold text-white inline-flex items-center gap-1">+{protectionAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                    </div>
                  )}

                  {addonsAmount > 0 && (
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الخدمات والإضافات المختارة' : 'Selected Add-ons'}</span>
                      <span className="font-bold text-white inline-flex items-center gap-1">+{addonsAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                    </div>
                  )}

                  {intercityFee > 0 && (
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'رسوم التسليم في مدينة أخرى' : 'Intercity Return Fee'}</span>
                      <span className="font-bold text-white inline-flex items-center gap-1">+{intercityFee} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#DFAB44] font-bold">
                      <span>{language === 'ar' ? 'خصم العرض الترويجي' : 'Promotional Discount'}</span>
                      <span className="inline-flex items-center gap-1">-{discountAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-400 pt-2 border-t border-[#3E3832]">
                    <span>{language === 'ar' ? 'ضريبة القيمة المضافة (15% VAT)' : 'VAT (15%)'}</span>
                    <span className="inline-flex items-center gap-1">{vatAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#3E3832] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block">{language === 'ar' ? 'المبلغ الإجمالي المستحق' : 'Total Amount'}</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">{totalAmount}</span>
                    <span className="text-xs font-bold text-[#DFAB44] ms-1 inline-flex items-center"><img src={currencyImg} alt="ريال" className="h-3.5 w-auto" /></span>
                  </div>
                  <span className="text-[11px] gold-gradient-bg text-[#1C1917] px-2.5 py-1 rounded font-bold border border-[#E9C682]">
                    {language === 'ar' ? 'شامل الضرائب والتأمين' : 'All Inclusive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION VOUCHER */}
          {step === 6 && confirmedBookingData && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#FAF3E8] text-[#C9922C] rounded-full flex items-center justify-center mx-auto border border-[#ECD9BA]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 mb-1">
                  {language === 'ar' ? 'تهانينا! تم تأكيد حجزك بنجاح' : 'Congratulations! Booking Confirmed'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  {language === 'ar'
                    ? 'تم إرسال رسالة نصية قصيرة SMS وبريد إلكتروني بتفاصيل العقد ورابط الاستلام الذكي.'
                    : 'An SMS and email confirmation with your smart digital contract and key pickup instructions have been dispatched.'}
                </p>
              </div>

              {/* Booking Card Voucher */}
              <div className="bg-[#FAF7F2] border border-[#EDE4D3] rounded-2xl p-6 text-start space-y-4 max-w-lg mx-auto shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EDE4D3] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase">
                      {language === 'ar' ? 'رقم مرجع الحجز' : 'Booking Reference'}
                    </span>
                    <div className="text-xl font-black text-[#A47018]">
                      {confirmedBookingData.bookingId}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white p-1 rounded-lg border border-[#EDE4D3] flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-stone-800" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">{language === 'ar' ? 'اسم المستأجر' : 'Driver Name'}</span>
                    <span className="font-bold text-stone-800">{confirmedBookingData.customer.fullName || 'سلطان المنصور'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{language === 'ar' ? 'السيارة المختارة' : 'Vehicle'}</span>
                    <span className="font-bold text-stone-800">{confirmedBookingData.car.name[language]}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{t.pickupLocation}</span>
                    <span className="font-bold text-stone-800">{confirmedBookingData.pickupBranch.name[language]}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{language === 'ar' ? 'موعد الاستلام' : 'Pickup Time'}</span>
                    <span className="font-bold text-stone-800">{confirmedBookingData.searchCriteria.pickupDate} ({confirmedBookingData.searchCriteria.pickupTime})</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Paid'}</span>
                    <span className="font-black text-[#A47018] inline-flex items-center gap-1">{confirmedBookingData.payment.totalAmount} <img src={currencyImg} alt="ريال" className="h-3 w-auto" /></span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">{language === 'ar' ? 'حالة الحجز' : 'Status'}</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#FAF3E8] text-[#61420B] font-bold text-[11px] border border-[#ECD9BA]">
                      {language === 'ar' ? 'مؤكد ونشط' : 'Confirmed & Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#EDE4D3] text-stone-800 text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طباعة قسيمة الحجز' : 'Print Voucher'}</span>
                </button>

                <button
                  onClick={() => {
                    closeBookingWizard();
                    navigateTo('manage-booking');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-[#DFAB44] text-xs font-bold shadow-md transition-colors flex items-center gap-2 border border-[#3E3832]"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'ar' ? 'عرض في إدارة الحجوزات' : 'View in Manage Booking'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {step < 6 && (
          <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE4D3] flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-[#EDE4D3] text-stone-700 text-xs font-bold hover:bg-white transition-colors flex items-center gap-1.5"
              >
                {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-3">
              {step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev + 1) as any)}
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs sm:text-sm font-bold shadow-md shadow-[#C9922C]/20 transition-colors flex items-center gap-1.5 border border-[#E9C682]"
                >
                  <span>{language === 'ar' ? 'متابعة' : 'Next Step'}</span>
                  {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              )}

              {step === 4 && (
                <button
                  type="submit"
                  form="driverForm"
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-xs sm:text-sm font-bold shadow-md shadow-[#C9922C]/20 transition-colors flex items-center gap-1.5 border border-[#E9C682]"
                >
                  <span>{language === 'ar' ? 'الانتقال للدفع' : 'Proceed to Payment'}</span>
                  {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  onClick={handleCompleteBooking}
                  className="px-8 py-3 rounded-xl gold-gradient-bg hover:brightness-105 text-[#1C1917] text-sm font-black shadow-lg shadow-[#C9922C]/30 transition-all flex items-center gap-2 border border-[#E9C682]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
                  <span className="inline-flex items-center gap-1">{language === 'ar' ? `تأكيد ودفع ${totalAmount}` : `Confirm & Pay ${totalAmount}`} <img src={currencyImg} alt="ريال" className="h-3.5 w-auto" /></span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
